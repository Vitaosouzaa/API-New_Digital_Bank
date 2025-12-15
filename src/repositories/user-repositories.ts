import { EntityManager } from "typeorm";
import { db } from "../services/UserService";
import { User } from "../entities/User";

export const deleteOneUser = (id: number) => {
  const index = db.findIndex((user) => user.id === id);
  if (index !== -1) {
    db.splice(index, 1);
    return true;
  }
  return false;
};

export class UserRepository {
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  createUser = async (user: User) => {
    return this.manager.save(user);
  };
}
