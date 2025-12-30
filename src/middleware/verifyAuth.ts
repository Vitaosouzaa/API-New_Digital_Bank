import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const parts = authToken.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!scheme || !token) {
    return res.status(401).json({ message: "Token malformatted" });
  }

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatted" });
  }

  try {
    // Usar variável de ambiente para JWT secret
    const tokenKey = process.env.JWT_SECRET || "123456789";
    const decoded = verify(token, tokenKey);
    
    // Adicionar informações do usuário na requisição
    (req as any).userId = (decoded as any).sub;
    (req as any).userEmail = (decoded as any).email;
    
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
