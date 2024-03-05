import { type JwtPayload } from "jsonwebtoken";
import { type UserEntity } from "../../entity/userEntity";

export interface CreateSessionType {
  user?: UserEntity;
  email?: string;
  password?: string;
  ip: string;
  userAgent: string;
}

export interface JwtRefreshTokenPayload {
  sessionId: string;
  userId: string;
}

export interface JwtAccessTokenPayload extends JwtRefreshTokenPayload {
  isVerifiedEmail: boolean;
  isBanned: boolean;
}

export interface JwtRefreshTokenClaims
  extends JwtRefreshTokenPayload,
    JwtPayload {}
export interface JwtAccessTokenClaims
  extends JwtAccessTokenPayload,
    JwtPayload {}
