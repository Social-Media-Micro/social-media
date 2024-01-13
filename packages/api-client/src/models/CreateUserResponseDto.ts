export interface UserType {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
  deactivatedAt: string;
  createdAt: string;
  updatedAt: string;
}

function CreateUserResponseDtoFromJSONTyped(json: any): UserType {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    _id: json["_id"],
    username: json["username"],
    email: json["email"],
    firstName: json["firstName"],
    lastName: json["lastName"],
    deactivatedAt: json["deactivatedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
  };
}

export function CreateUserResponseDtoFromJSON(json: any): UserType {
  return CreateUserResponseDtoFromJSONTyped(json);
}
