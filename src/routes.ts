import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { LoginController } from "./controllers/LoginController";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();

router.get("/user", userController.getUsers);
router.post("/login", loginController.login);

router.post("/user", userController.createUser);

router.delete("/user", userController.deleteUser);
