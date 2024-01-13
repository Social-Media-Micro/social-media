export type ServerError = {
  status?: number;
  errors: {
    message: string;
    data: any;
  };
};

export type SuccessResult<T> = {
  remote: Extract<RemoteDataStatus, "success">;
  data: {
    data: T;
    message: string;
    status: number;
  };
};

export type ErrorResult = {
  remote: Extract<RemoteDataStatus, "failure">;
  error: ServerError;
};

export type RemoteDataStatus = "success" | "failure";
