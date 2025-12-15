import { EntityManager } from "typeorm";
import { getMockEntityManager } from "../__mocks__/mockEntityManager.mock";
import { User } from "../entities/User";
import { UserRepository } from "./user-repositories";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let managerMock: Partial<EntityManager>;

  const mockUser: User = {
    user_id: "1223",
    name: "Teste",
    email: "teste@email.com",
    password: "password",
  };

  beforeAll(async () => {
    managerMock = await getMockEntityManager({});
    userRepository = new UserRepository(managerMock as EntityManager);
  });

  it("deve cadastrar um novo usuário no banco de dados", async () => {
    await userRepository.createUser(mockUser);
    expect(managerMock.save).toHaveBeenCalled();
  });
});
