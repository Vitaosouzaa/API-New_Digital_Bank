import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {
    const user = req.body;

    if (!user.name || !user.email || !user.password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Todos os campos são Obrigatórios" });
    }

    const response = await this.userService.createUser(user.name, user.email, user.password);
    const statusCode = response.statusCode || 201;
    return res.status(statusCode).json(response.body);
  };

  getUsers = (req: Request, res: Response) => {
    return res.status(200);
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id é obrigatório" });
    }

    const response = await this.userService.deleteUser(user_id);
    return res.status(200).json(response.body);
  };
}
