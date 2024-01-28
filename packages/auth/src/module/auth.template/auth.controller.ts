import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";

class AuthController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      res.sendCreated201Response("User created successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };
}

export default AuthController;
