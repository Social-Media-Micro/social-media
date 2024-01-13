export interface AccessTokensResponseDto {
  accessToken: string;
  refreshToken: string;
}
export function AccessTokensResponseDtoFromJSON(
  json: any
): AccessTokensResponseDto {
  return AccessTokensResponseDtoFromJSONTyped(json);
}

export function AccessTokensResponseDtoFromJSONTyped(
  json: any
): AccessTokensResponseDto {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    accessToken: json["accessToken"],
    refreshToken: json["refreshToken"],
  };
}

export function AccessTokensResponseDtoToJSON(
  value?: AccessTokensResponseDto | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    accessToken: value.accessToken,
    refreshToken: value.refreshToken,
  };
}
