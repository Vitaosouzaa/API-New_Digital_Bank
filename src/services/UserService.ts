import { sign, SignOptions } from "jsonwebtoken";
import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repositories";
import * as HttpResponse from "../utils/http-helper";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository(AppDataSource.manager)) {
    this.userRepository = userRepository;
  }

  createUser = async (name: string, email: string, password: string) => {
    try {
      const user = new User(name, email, password);
      await this.userRepository.createUser(user);
      return HttpResponse.created({ message: "User created successfully" });
    } catch (error: any) {
      if (
        error.code === "SQLITE_CONSTRAINT" ||
        error.message.includes("UNIQUE")
      ) {
        return HttpResponse.conflict({ message: "Email already registered" });
      }
      return HttpResponse.serverError({ message: "Error creating user" });
    }
  };

  getUser = async (userID: string): Promise<User | null> => {
    return this.userRepository.getUser(userID);
  };

  getAuthenticatedUser = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    return this.userRepository.getUserByEmailAndPassword(email, password);
  };

  getToken = async (email: string, password: string): Promise<string> => {
    const user = await this.getAuthenticatedUser(email, password);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const tokenData = {
      name: user?.name,
      email: user?.email,
    };

    // Usar variável de ambiente para JWT secret
    const tokenKey = process.env.JWT_SECRET || "123456789";

    const tokenOptions: SignOptions = {
      subject: user?.user_id,
      expiresIn: "7d", // Token expira em 7 dias
    };

    const token = sign(tokenData, tokenKey, tokenOptions);

    return token;
  };

  deleteUser = async (userId: string) => {
    const isDeleted = await this.userRepository.deleteUser(userId);
    if (isDeleted) {
      return HttpResponse.ok({ message: "User deleted successfully" });
    } else {
      return HttpResponse.badRequest();
    }
  };
}
