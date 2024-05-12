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
import { SendRegistrationOtpPublisher } from "../../events/send-registration-otp-publisher";
import OtpGenerator from "@monorepo/common/src/utils/otpGenerator";
import redisConnect from "../../utils/redisConnection";
import registrationOtpKey from "@monorepo/common/src/redisKey/registrationOtp";
import logger from "@monorepo/common/src/utils/logger";

export class UserService {
  private readonly _DataSource = db.AppDataSource;
  private readonly _redisClient = redisConnect.client;
  private readonly _userRepository = this._DataSource.getRepository(UserEntity);
  public async findOneWithOptions(
    options: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this._userRepository.findOne({ where: options });
    return user;
  }

  public async findByIdAndUpdate(userId: string, body: Partial<UserEntity>) {
    const user = await this._userRepository.findOneBy({ id: userId });
    if (user) {
      await this._userRepository.update({ id: userId }, body);
      return await this._userRepository.findOneBy({ id: userId });
    }
    return null;
  }

  public async findOneAndUpdate(
    filter: FindOptionsWhere<UserEntity>,
    body: Partial<UserEntity>,
  ) {
    const user = await this._userRepository.findOneBy(filter);
    if (user) {
      await this._userRepository.update(filter, body);
      return await this._userRepository.findOneBy({ id: user.id });
    }
    return null;
  }

  public async create(
    user: UserDto,
    isVerifiedEmail: boolean = false,
  ): Promise<UserEntity> {
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
    newUser.isVerifiedEmail = isVerifiedEmail;
    if (user.mobileNumber) newUser.mobileNumber = user.mobileNumber;

    await this._userRepository.save(newUser);

    // publish event
    const kafka = kafkaWrapper.client;
    const createUserPublisher = new UserCreatedPublisher(kafka);
    await createUserPublisher.publish({
      id: newUser.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      username: user.username,
      version: user.version,
    });

    const sendRegistrationOtpPublisher = new SendRegistrationOtpPublisher(
      kafka,
    );
    const otpGenerator = new OtpGenerator();
    const otp = otpGenerator.numberGenerate(6);
    const redisKey = registrationOtpKey(newUser.id);
    try {
      await this._redisClient.setEx(redisKey, 900, otp);
      await sendRegistrationOtpPublisher.publish({ otp });
    } catch (error) {
      logger.error("Error saving otp in radis");
    }

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
