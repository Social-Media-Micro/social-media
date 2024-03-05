import {
  type CreateSessionType,
  type JwtAccessTokenPayload,
  type JwtRefreshTokenPayload,
} from "./auth.types";
import { UserSessionEntity } from "../../entity/userSessionEntity";
import db from "../../utils/dbConnection";
import { type FindOptionsWhere } from "typeorm";
import JwtService from "../../utils/jwt";
import { UserService } from "../user/user.service";
import { type UserEntity } from "../../entity/userEntity";

export class AuthService {
  private readonly _jwtService = new JwtService();
  private readonly _userService = new UserService();
  private readonly _DataSource = db.AppDataSource;
  private readonly _userSessionRepositry =
    this._DataSource.getRepository(UserSessionEntity);

  public async findUserSessionWith(
    options: FindOptionsWhere<UserSessionEntity>,
  ): Promise<UserSessionEntity | null> {
    const user = await this._userSessionRepositry.findOneBy(options);
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
}
