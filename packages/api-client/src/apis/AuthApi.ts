import urlcat from "urlcat";
import { CreateUserRequestDto } from "../models/CreateUserRequestDto";
import {
  CreateUserResponseDtoFromJSON,
  UserType,
} from "../models/CreateUserResponseDto";
import * as runetime from "../runtime";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { AccessTokensResponseDto } from "../models/AccessTokensResponseDto";

class _AuthApi extends runetime.BaseAPI {
  constructor() {
    super();
  }
  async createUser(
    requestParameters: CreateUserRequestDto
  ): Promise<SuccessResult<UserType> | ErrorResult> {
    const response = await this.request({
      url: `/auth/create-user`,
      method: "POST",
      data: requestParameters,
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
  async logout(): Promise<SuccessResult<string> | ErrorResult> {
    const response = await this.request({
      url: `/auth/logout`,
      method: "PUT",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }

  async refreshAccessToken(
    token: string
  ): Promise<SuccessResult<AccessTokensResponseDto> | ErrorResult> {
    const response = await this.request({
      url: urlcat(`/auth/refresh-access-token`, { token }),
      method: "GET",
    });
    if (response.remote === "success") {
      return {
        remote: "success",
        data: {
          message: response.data.message,
          status: response.data.status,
          data: response.data.data,
        },
      };
    }
    return response as ErrorResult;
  }
}

export const AuthApi = new _AuthApi();
