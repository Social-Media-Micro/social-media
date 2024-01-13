import {
  CreateUserResponseDtoFromJSON,
  UserType,
} from "../models/CreateUserResponseDto";
import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";

class _UserApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  public getCurrentUserPath = "/api/user/current-user";
  /**
   * Gets the current authenticated user
   */
  async getCurrentUser(): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/user/current-user`,
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: CreateUserResponseDtoFromJSON(response.data.data),
        },
      };
    }
    return response as ErrorResult;
  }
}

export const UserApi = new _UserApi();
