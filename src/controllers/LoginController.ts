import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class LoginController {
  userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validações
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const token = await this.userService.getToken(
        email.trim().toLowerCase(), 
        password
      );

      return res.status(200).json({ token });
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Retornar 401 (Unauthorized) para credenciais inválidas, não 500
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }
      
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  };
}
