import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

export class LoginController {
  login = async (req: Request, res: Response) => {
    const tokenData = {
      name: user.name,
      email: user.email,
    };

    const tokenKey = "12345";

    const tokenOptions = {
      subject: user.user_id,
    };

    const token = sign(tokenData, tokenKey, tokenOptions);

    return res.status(200).json({ token });
  };
}
