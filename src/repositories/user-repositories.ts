import { db } from "../services/UserService";

export const deleteOneUser = (id: number) => {
  const index = db.findIndex((user) => user.id === id);
  if (index !== -1) {
    db.splice(index, 1);
    return true;
  }
  return false;
};
