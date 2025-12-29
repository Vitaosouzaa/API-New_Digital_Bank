import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { LoginController } from "./controllers/LoginController";
import { verifyAuth } from "./middleware/verifyAuth";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();

router.get("/user/:userId", verifyAuth, userController.getUser);

router.post("/user", userController.createUser);
router.post("/login", loginController.login);

router.delete("/user", userController.deleteUser);
