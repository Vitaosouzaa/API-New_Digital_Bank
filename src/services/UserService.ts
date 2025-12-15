import { IUser } from "../interfaces/IUser";
import { deleteOneUser } from "../repositories/user-repositories";
import * as HttpResponse from "../utils/http-helper";

export const db = [
  {
    id: 1,
    name: "Joana",
    email: "Joana23@gmail.com",
  },
];

export class UserService {
  db: IUser[];

  constructor(database = db) {
    this.db = database;
  }

  createUser = (id: number, name: string, email: string) => {
    const user = {
      id,
      name,
      email,
    };
    this.db.push(user);
    return this.db;
  };

  getAllUsers = () => {
    return this.db;
  };

  deleteUser = (id: number) => {
    let response = null;
    const isDeleted = deleteOneUser(id);
    if (isDeleted) {
      response = HttpResponse.ok({ message: "deleted" });
    } else {
      response = HttpResponse.badRequest();
    }
    return response;
  };
}
