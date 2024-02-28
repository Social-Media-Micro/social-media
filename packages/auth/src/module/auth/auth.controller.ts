import { type Request, type Response } from "express";
import { UserService } from "../user/user.service";
import { kafkaWrapper } from "../../kafkaWrapper";
import { UserCreatedPublisher } from "../../events/user-created-publisher";

class AuthController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      // publish event
      const kafka = kafkaWrapper.client;
      const publisher = new UserCreatedPublisher(kafka);
      await publisher.publish({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: "user.mobileNumber",
        username: user.username,
        version: "user.version",
      });
      res.sendCreated201Response("User created successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };
}

export default AuthController;
