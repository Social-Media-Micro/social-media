export class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  mobileNumber: string;
  isVarified: boolean;
  isBanned: boolean;
  isActive: boolean;
  lastActive: string;
  version: number;
  createdAt: string;
  updatedAt: string;

  constructor(user: Partial<UserDto>) {
    Object.assign(this, user);
  }
}
