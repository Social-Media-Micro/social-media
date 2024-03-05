import db from "../../utils/dbConnection";
import { type UserDto } from "../../dto/user.dto";
import { UserEntity } from "../../entity/userEntity";
import { type FindOptionsWhere } from "typeorm";
import {
  EmailAlreadyExistsError,
  UserNotFound,
  UsernameAlreadyExistsError,
} from "./user.errors";
import { kafkaWrapper } from "../../kafkaWrapper";
import { UserCreatedPublisher } from "../../events/user-created-publisher";
import bcrypt from "bcrypt";

export class UserService {
  private readonly _DataSource = db.AppDataSource;
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
      throw new EmailAlreadyExistsError(user.email);
    }
    const existingUserWithUsername = await this.findOneWithOptions({
      username: user.username,
    });
    if (existingUserWithUsername) {
      throw new UsernameAlreadyExistsError(user.username);
    }
    const newUser = new UserEntity();
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.username = user.username;
    if (user.mobileNumber) newUser.mobileNumber = user.mobileNumber;

    await this._userRepository.save(newUser);

    // publish event
    const kafka = kafkaWrapper.client;
    const publisher = new UserCreatedPublisher(kafka);
    await publisher.publish({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      username: user.username,
      version: user.version,
    });

    return newUser;
  }

  public async verifyPassword(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.findOneWithOptions({ email });
    if (!user) {
      throw new UserNotFound("Invalid Email or Password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UserNotFound("Invalid Email or Password");
    }
    return user;
  }
}
