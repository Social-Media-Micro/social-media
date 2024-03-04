import { AppDataSource } from "../../utils/dbConnection";
import { type UserDto } from "../../dto/user.dto";
import { UserEntity } from "../../entity/userEntity";
import { type FindOptionsWhere } from "typeorm";

export class UserService {
  private readonly _DataSource = AppDataSource;
  private readonly _userRepository = this._DataSource.getRepository(UserEntity);

  public async findOneWithOptions(
    options: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this._userRepository.findOneBy(options);
    return user;
  }

  public async create(user: UserDto): Promise<UserEntity> {
    const existingUserWithEmail = await this.findOneWithOptions({
      email: user.email,
    });
    if (existingUserWithEmail) {
      throw new Error("Email Already Exists");
    }
    const existingUserWithUsername = await this.findOneWithOptions({
      username: user.username,
    });
    if (existingUserWithUsername) {
      throw new Error("Username Already Exists");
    }
    const newUser = new UserEntity();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.username = user.username;
    if (user.mobileNumber) newUser.mobileNumber = user.mobileNumber;

    await this._userRepository.save(newUser);

    return newUser;
  }
}
