class BaseError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export class EmailAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super(`Email "${email}" is already in use`);
  }
}

export class UsernameAlreadyExistsError extends BaseError {
  constructor(username: string) {
    super(`Username "${username}" is already taken`);
  }
}
export class UserNotFound extends BaseError {
  constructor(msg: string) {
    super(`${msg}`);
  }
}
