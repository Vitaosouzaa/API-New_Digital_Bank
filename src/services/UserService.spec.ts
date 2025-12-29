import { UserService } from "./UserService";
import * as jwt from "jsonwebtoken";

const mockUserRepository = {
  createUser: jest.fn(),
  deleteUser: jest.fn(),
  getUser: jest.fn(),
};
jest.mock("jsonwebtoken");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userService = new UserService(mockUserRepository as any);
  const mockUser = {
    user_id: "123",
    name: "Vitor",
    email: "vitoorsouzaa123@gmail.com",
    password: "12345",
  };

  it("Deve adicionar um novo usuário com sucesso", async () => {
    mockUserRepository.createUser.mockResolvedValueOnce({
      user_id: "123",
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

  it("Deve retornar um token de usuário autenticado", async () => {
    jest
      .spyOn(userService, "getAuthenticatedUser")
      .mockImplementation(() => Promise.resolve(mockUser));

    jest.spyOn(jwt, "sign").mockImplementation(() => "token");
    const token = await userService.getToken(
      "vitoorsouzaa123@gmail.com",
      "12345"
    );

    expect(token).toBe("token");
  });

  it("Deve retornar um erro caso não encontre o usuário", async () => {
    jest
      .spyOn(userService, "getAuthenticatedUser")
      .mockImplementation(() => Promise.resolve(null));
    await expect(
      userService.getToken("invalid@email.com", "invalidPassword")
    ).rejects.toThrow("Invalid credentials");
  });
});
