import {
  type JwtRefreshTokenClaims,
  type CreateSessionType,
  type JwtAccessTokenPayload,
  type JwtRefreshTokenPayload,
  type JwtAccessTokenClaims,
  type ForgetPasswordTokenPayload,
} from "./auth.types";
import { UserSessionEntity } from "../../entity/userSessionEntity";
import db from "../../utils/dbConnection";
import { type FindOptionsWhere } from "typeorm";
import JwtService from "@monorepo/common/src/utils/jwt";
import { UserService } from "../user/user.service";
import { type UserEntity } from "../../entity/userEntity";
import { InvalidRefreshTokenError, SessionExpiredError } from "./auth.errors";
import { UserNotFound } from "../user/user.errors";
import registrationOtpKey from "@monorepo/common/src/redisKey/registrationOtp";
import redisConnect from "../../utils/redisConnection";
import { kafkaWrapper } from "../../kafkaWrapper";
import { EmailVerifiedSuccessfullyPublisher } from "../../events/email-verified-successfully";

export class AuthService {
  private readonly _jwtService = new JwtService();
  private readonly _userService = new UserService();
  private readonly _redisClient = redisConnect.client;
  private readonly _DataSource = db.AppDataSource;
  private readonly _userSessionRepositry =
    this._DataSource.getRepository(UserSessionEntity);

  public async findUserSessionWith(
    options: FindOptionsWhere<UserSessionEntity>,
  ): Promise<UserSessionEntity | null> {
    const user = await this._userSessionRepositry.findOne({
      where: options,
      relations: { user: true },
    });
    return user;
  }

  public async createSession(payload: CreateSessionType) {
    let user: UserEntity;
    if (payload.user) {
      user = payload.user;
    } else {
      user = await this._userService.verifyPassword(
        payload.email ?? "",
        payload.password ?? "",
      );
    }

    // create session
    const newSession = new UserSessionEntity();
    newSession.userAgent = payload.userAgent;
    newSession.ip = payload.ip;
    newSession.user = user;
    await this._userSessionRepositry.save(newSession);
    // create accessToken and refreshToken
    const accessTokenPayload: JwtAccessTokenPayload = {
      sessionId: newSession.id,
      userId: user.id,
      isVerifiedEmail: user.isVerifiedEmail,
      isBanned: user.isBanned,
    };

    const accessToken = this.createAccessToken(accessTokenPayload);

    const refreshTokenPayload: JwtRefreshTokenPayload = {
      sessionId: newSession.id,
      userId: user.id,
    };
    const refreshToken = this.createRefreshToken(refreshTokenPayload);
    return { accessToken, refreshToken };
  }

  private createAccessToken(payload: JwtAccessTokenPayload) {
    if (!process.env.JWT_ACCESS_TOKEN_TTL) {
      throw new Error("JWT_ACCESS_TOKEN_TTL is required");
    }
    return this._jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
    });
  }

  private createRefreshToken(payload: JwtRefreshTokenPayload) {
    if (!process.env.JWT_REFRESH_TOKEN_TTL) {
      throw new Error("JWT_REFRESH_TOKEN_TTL is required");
    }
    return this._jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
    });
  }

  public async getAccessTokenFromRefreshToken(refreshToken: string) {
    // Verify refreshToken
    const decoded = this._jwtService.verify(
      refreshToken,
    ) as JwtRefreshTokenClaims;
    if (!decoded) {
      throw new InvalidRefreshTokenError();
    }
    const { sessionId } = decoded;
    const userSession = await this.findUserSessionWith({
      id: sessionId,
    });
    if (!userSession?.isValidSession) {
      throw new SessionExpiredError();
    }
    // Generate accessToken
    const userDetails = await this._userService.findOneWithOptions({
      id: userSession.user.id,
    });
    if (userDetails) {
      const accessTokenPayload: JwtAccessTokenPayload = {
        sessionId: userSession.id,
        userId: userDetails.id,
        isVerifiedEmail: userDetails.isVerifiedEmail,
        isBanned: userDetails.isBanned,
      };
      const accessToken = this.createAccessToken(accessTokenPayload);
      return accessToken;
    }
    throw new UserNotFound("User with refresh token is not exist");
  }

  public verifyAccessToken(token: string): JwtAccessTokenClaims | null {
    try {
      const decoded = this._jwtService.verify(token) as JwtAccessTokenClaims;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public async logoutSession(sessionId: string) {
    try {
      const session = await this.findUserSessionWith({
        id: sessionId,
      });
      if (!session) {
        throw new Error("Session not found");
      }
      // Update session details
      session.isValidSession = false;
      session.expiresAt = new Date();
      await this._userSessionRepositry.save(session);
      return session;
    } catch (error) {
      throw new Error(`Error updating session: ${error.message}`);
    }
  }

  public async verifyOtp({ otp, userId }: { otp: string; userId: string }) {
    const redisKey = registrationOtpKey(userId);
    const orignalOtp = await this._redisClient.get(redisKey);
    if (orignalOtp !== otp) {
      throw new Error("Invalid Otp");
    }
    const updatedUser = await this._userService.findByIdAndUpdate(userId, {
      isVerifiedEmail: true,
    });
    if (updatedUser) {
      const kafka = kafkaWrapper.client;
      const emailVerifiedSuccessfullyPublisher =
        new EmailVerifiedSuccessfullyPublisher(kafka);
      await emailVerifiedSuccessfullyPublisher.publish({
        message: "Email Verified Successfully",
      });
    }
    return updatedUser;
  }

  public async generateForgetPasswordToken({ email }: { email: string }) {
    const user = this._userService.findOneWithOptions({ email });
    if (!user) {
      return null;
    }
    const forgetPasswordToken: ForgetPasswordTokenPayload = {
      email,
    };
    const token = this._jwtService.sign(forgetPasswordToken, {
      expiresIn: process.env.JWT_FORGET_PASSWORD_TOKEN_TTL,
    });
    return token;
  }
}
