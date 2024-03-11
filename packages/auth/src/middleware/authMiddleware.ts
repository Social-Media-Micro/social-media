import { type NextFunction, type Request, type Response } from "express";
import { AuthService } from "../module/auth/auth.service";
import { UserService } from "../module/user/user.service";

class AuthMiddleware {
  private readonly authService = new AuthService();
  private readonly userService = new UserService();

  public protect = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    const accessToken = authorization?.split("Bearer ")[1];

    if (!accessToken) {
      res.sendUnauthorized401Response("Invalid access token", {});
      return;
    }
    // veriy accessToken
    const decoded = this.authService.verifyAccessToken(accessToken);
    if (decoded) {
      const session = await this.authService.findUserSessionWith({
        id: decoded.sessionId,
        isValidSession: true,
      });
      if (!session) {
        res.sendUnauthorized401Response("Session already expired", {});
        return;
      }
      const user = await this.userService.findOneWithOptions({
        id: session.user.id,
      });
      if (!user) {
        res.sendUnauthorized401Response("Invalid Access Token", {});
        return;
      }
      req.user = user;
      req.sessionId = session.id;
      next();
    }
  };
}

export default AuthMiddleware;
