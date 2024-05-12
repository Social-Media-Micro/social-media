import { type Request, type Response } from "express";
import { UserService } from "../user/user.service";

import { UserDto } from "../../dto/user.dto";
import { AuthService } from "./auth.service";
import { type CreateSessionType } from "./auth.types";
import { kafkaWrapper } from "../../kafkaWrapper";
import { SendForgetPasswordLink } from "../../events/send-forget-password-link";

class AuthController {
  private readonly _userService: UserService = new UserService();
  private readonly _authService: AuthService = new AuthService();

  public createUser = async (req: Request, res: Response) => {
    try {
      const userDto = new UserDto(req.body);
      const user = await this._userService.create(userDto);
      const payload: CreateSessionType = {
        user,
        ip:
          req.ip ??
          (req.headers["X-Forwarded-For"]
            ? req.headers["X-Forwarded-For"][0]
            : ""),
        userAgent: req.headers["user-agent"] ?? "",
      };
      const { accessToken, refreshToken } =
        await this._authService.createSession(payload);
      res.sendCreated201Response("User created successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.statusCode) {
        res.sendBadRequest400Response("Error creating user", error.message);
      } else {
        res.sendErrorResponse("Error creating user", error);
      }
    }
  };

  public createSession = async (req: Request, res: Response) => {
    try {
      const payload: CreateSessionType = {
        email: req.body.email,
        password: req.body.password,
        ip:
          req.ip ??
          (req.headers["X-Forwarded-For"]
            ? req.headers["X-Forwarded-For"][0]
            : ""),
        userAgent: req.headers["user-agent"] ?? "",
      };
      const { accessToken, refreshToken } =
        await this._authService.createSession(payload);
      res.sendCreated201Response("User created successfully", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.statusCode) {
        res.sendBadRequest400Response(
          "Error creating user session",
          error.message,
        );
      } else {
        res.sendErrorResponse("Error creating user session", error);
      }
    }
  };

  public verifyEmailAddressViaOtp = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.sendForbidden403Response("Unauthorized", {});
        return;
      }
      const user = await this._authService.verifyOtp({
        otp: req.body.otp,
        userId: req.user.id,
      });
      if (!user) {
        res.sendBadRequest400Response("Invalid Otp", {});
      } else {
        const payload: CreateSessionType = {
          user,
          ip:
            req.ip ??
            (req.headers["X-Forwarded-For"]
              ? req.headers["X-Forwarded-For"][0]
              : ""),
          userAgent: req.headers["user-agent"] ?? "",
        };
        const { accessToken, refreshToken } =
          await this._authService.createSession(payload);
        res.sendCreated201Response("Otp Verified successfully", {
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      res.sendErrorResponse("Error creating user session", error);
    }
  };

  public refreshAccessTokenViaRefreshToken = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const accessToken =
        await this._authService.getAccessTokenFromRefreshToken(refreshToken);

      res.sendSuccess200Response("Access Token Generated Successfully", {
        accessToken,
      });
    } catch (error) {
      res.sendUnauthorized401Response("Invalid refreshing access token", {});
    }
  };

  public logout = async (req: Request, res: Response) => {
    if (!req.sessionId) {
      return;
    }
    try {
      await this._authService.logoutSession(req.sessionId);
      res.status(200).send({ message: "User logout successfully" });
    } catch (error) {
      res.sendBadRequest400Response("Error logging out user", {
        error: error.message,
      });
    }
  };

  public sendForgetPasswordLink = async (req: Request, res: Response) => {
    const { email } = req.body;
    const token = await this._authService.generateForgetPasswordToken({
      email,
    });
    if (token) {
      const kafka = kafkaWrapper.client;
      const sendForgetPasswordLinkPublisher = new SendForgetPasswordLink(kafka);
      await sendForgetPasswordLinkPublisher.publish({ token });
    }
    res.sendSuccess200Response(
      "Email sent if account is existed in our database",
      {},
    );
  };

  public resetPasswordFromToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const forgetPasswordPayload =
        await this._authService.verfiyForgetPasswordToken(token);
      const updatedUser = await this._userService.findOneAndUpdate(
        {
          email: forgetPasswordPayload.email,
        },
        {
          password: newPassword as string,
        },
      );
      if (updatedUser) {
        res.sendSuccess200Response("Password updated successfully", {});
        return;
      }
      res.sendBadRequest400Response("User not found", {});
    } catch (error) {
      if (error.statusCode) {
        res.sendBadRequest400Response("Invlaid Token", error.message);
      } else {
        res.sendErrorResponse("Internal Server error", {});
      }
    }
  };
}

export default AuthController;
