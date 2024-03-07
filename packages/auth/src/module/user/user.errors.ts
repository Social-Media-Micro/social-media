import BaseError from "@monorepo/common/src/utils/baseError";
export class EmailAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super(400, `Email "${email}" is already in use`);
  }
}

export class UsernameAlreadyExistsError extends BaseError {
  constructor(username: string) {
    super(400, `Username "${username}" is already taken`);
  }
}
export class UserNotFound extends BaseError {
  constructor(msg: string) {
    super(404, `${msg}`);
  }
}
