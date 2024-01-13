export interface CreateUserRequestDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

function CreateUserRequestDtoFromJSONTyped(json: any): CreateUserRequestDto {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    username: json["username"],
    email: json["email"],
    password: json["password"],
    firstName: json["firstName"],
    lastName: json["lastName"],
  };
}

export function CreateUserRequestDtoFromJSON(json: any): CreateUserRequestDto {
  return CreateUserRequestDtoFromJSONTyped(json);
}
