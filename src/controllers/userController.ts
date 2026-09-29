import type { Request, Response } from "express";
import { UserService } from "../services/userService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { CreateUserInput } from "../schemas/userSchema.ts";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.userService.getAllUsers();
    res.status(200).json({ status: "success", data });
  };

  createUser = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateUserInput>(res, "body");
    const user = await this.userService.createUser(body);
    res.status(201).json({ status: "success", data: user });
  };
}