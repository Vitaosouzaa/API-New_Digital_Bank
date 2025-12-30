import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = req.body;

      // Validações
      if (!user.name || !user.email || !user.password) {
        return res
          .status(400)
          .json({ message: "Bad Request: Todos os campos são Obrigatórios" });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: "Email inválido" });
      }

      // Validar tamanho mínimo da senha
      if (user.password.length < 6) {
        return res.status(400).json({ message: "Senha deve ter no mínimo 6 caracteres" });
      }

      const response = await this.userService.createUser(
        user.name.trim(),
        user.email.trim().toLowerCase(),
        user.password
      );
      const statusCode = response.statusCode || 201;
      return res.status(statusCode).json(response.body);
    } catch (error: any) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: "Error creating user" });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "userId é obrigatório" });
      }

      const user = await this.userService.getUser(userId as string);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json({
        userId: user.user_id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      console.error('Error getting user:', error);
      return res.status(500).json({ message: "Error getting user" });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: "user_id é obrigatório" });
      }

      const response = await this.userService.deleteUser(user_id);
      return res.status(200).json(response.body);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: "Error deleting user" });
    }
  };
}
