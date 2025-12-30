import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./controllers/UserController";
import { LoginController } from "./controllers/LoginController";
import { verifyAuth } from "./middleware/verifyAuth";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();

// Rotas públicas
router.post("/user", userController.createUser);
router.post("/login", loginController.login);

// Rotas protegidas (requerem autenticação)
router.get("/user/:userId", verifyAuth, userController.getUser);
router.delete("/user", verifyAuth, userController.deleteUser);

// Middleware de tratamento de erro para as rotas
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Route error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
