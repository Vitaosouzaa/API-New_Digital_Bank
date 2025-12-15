import { IUser } from "../interfaces/IUser";
import { UserService } from "./UserService";

describe("UserService", () => {
  const mockDb: IUser[] = [];
  const userService = new UserService(mockDb);

  it("Deve adicionar um novo usuário", () => {
    const result = userService.createUser(
      2,
      "Vitor",
      "vitoorsouzaa123@gmail.com"
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 2,
      name: "Vitor",
      email: "vitoorsouzaa123@gmail.com",
    });
  });

  it("Deve mostrar todos os usuários", () => {
    const result = userService.getAllUsers();
    expect(result).toHaveLength(1);
  });
});
