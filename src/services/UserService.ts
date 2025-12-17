import { AppDataSource } from "../database";
import { User } from "../entities/User";
import { IUser } from "../interfaces/IUser";
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

  getUser = (email: string, password: string) => {};

  getAuthenticatedUser = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    return this.userRepository.getUserByEmailAndPassword(email, password);
  };

  getToken = () => {
    const user = this.getAuthenticatedUser;
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
