import BaseError from "@monorepo/common/src/utils/baseError";

export class InvalidRefreshTokenError extends BaseError {
  constructor() {
    super(400, "Invalid refresh token");
  }
}
export class SessionExpiredError extends BaseError {
  constructor() {
    super(400, "Session already expired");
  }
}

export class InvalidForgetPasswordTokenError extends BaseError {
  constructor() {
    super(400, "Invalid Forget Password Token");
  }
}
