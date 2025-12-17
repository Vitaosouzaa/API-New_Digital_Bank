import { UserService } from "./UserService";

const mockUserRepository = {
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  getUser: jest.fn(),
};

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userService = new UserService(mockUserRepository as any);

  it("Deve adicionar um novo usuário com sucesso", async () => {
    mockUserRepository.createUser.mockResolvedValueOnce({
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Vitor",
      email: "vitoorsouzaa123@gmail.com",
      password: "12345",
    });

    const response = await userService.createUser(
      "Vitor",
      "vitoorsouzaa123@gmail.com",
      "12345"
    );

    expect(mockUserRepository.createUser).toHaveBeenCalled();
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      message: "User created successfully",
    });
  });

  it("Deve retornar erro 409 quando email já existe", async () => {
    const error = new Error("UNIQUE constraint failed: users.email");
    (error as any).code = "SQLITE_CONSTRAINT";
    mockUserRepository.createUser.mockRejectedValueOnce(error);

    const response = await userService.createUser(
      "Vitor",
      "vitoorsouzaa123@gmail.com",
      "12345"
    );

    expect(response.statusCode).toBe(409);
    expect(response.body).toMatchObject({
      message: "Email already registered",
    });
  });

  it("Deve retornar erro 500 em caso de erro interno", async () => {
    mockUserRepository.createUser.mockRejectedValueOnce(
      new Error("Database error")
    );

    const response = await userService.createUser(
      "Vitor",
      "vitoorsouzaa123@gmail.com",
      "12345"
    );

    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({ message: "Error creating user" });
  });

  it("Deve retornar um token de usuário autenticado", async () => {});

  // it("Deve mostrar todos os usuários", () => {
  //   const result = userService.getAllUsers();
  //   expect(result).toHaveLength(1);
  // });
});
