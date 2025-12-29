import { Request } from "express";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserController } from "./UserController";

const mockUserService = {
  createUser: jest.fn().mockResolvedValue({
    statusCode: 201,
    body: { message: "User created successfully" },
  }),
  getUser: jest.fn(),
  deleteUser: jest.fn().mockResolvedValue({
    statusCode: 200,
    body: { message: "User deleted successfully" },
  }),
};

jest.mock("../services/UserService", () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return mockUserService;
    }),
  };
});

describe("UserController", () => {
  const userController = new UserController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve adicionar um novo usuario", async () => {
    const mockRequest = makeMockRequest({
      body: { name: "João", email: "joao@email.com", password: "12345" },
    });
    const mockResponse = makeMockResponse();
    mockUserService.createUser.mockResolvedValueOnce({
      statusCode: 201,
      body: { message: "User created successfully" },
    });

    await userController.createUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(201);
    expect(mockResponse.state.json).toMatchObject({
      message: "User created successfully",
    });
  });

  it("Deve retornar um erro se o usuário não informar um name", async () => {
    const mockRequest = makeMockRequest({
      body: { name: "", email: "joao@email.com", password: "12345" },
    });
    const mockResponse = makeMockResponse();
    await userController.createUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request: Todos os campos são Obrigatórios",
    });
  });

  it("Deve retornar erro ao tentar adicionar um usuário sem email", async () => {
    const mockRequest = makeMockRequest({
      body: { name: "João", email: "", password: "12345" },
    });
    const mockResponse = makeMockResponse();
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request: Todos os campos são Obrigatórios",
    });
  });

  it("Deve retornar erro ao tentar adicionar um usuário sem password", async () => {
    const mockRequest = makeMockRequest({
      body: { name: "João", email: "joao@email.com", password: "" },
    });
    const mockResponse = makeMockResponse();
    await userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request: Todos os campos são Obrigatórios",
    });
  });

  it("Deve retornar uma mensagem de usuário deletado", async () => {
    const mockRequest = {
      body: {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
      },
    } as Request;
    const mockResponse = makeMockResponse();

    mockUserService.deleteUser.mockResolvedValueOnce({
      statusCode: 200,
      body: { message: "User deleted successfully" },
    });

    await userController.deleteUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(200);
    expect(mockResponse.state.json).toMatchObject({
      message: "User deleted successfully",
    });
  });

  it("Deve retornar erro se user_id não for fornecido", async () => {
    const mockRequest = {
      body: {},
    } as Request;
    const mockResponse = makeMockResponse();

    await userController.deleteUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "user_id é obrigatório",
    });
  });

  it("Deve retornar o usuário com o userID fornecido", async () => {
    const mockRequest = makeMockRequest({
      params: { userId: "123" },
    });
    const mockResponse = makeMockResponse();

    await userController.getUser(mockRequest, mockResponse);
    expect(mockUserService.getUser).toHaveBeenCalledWith("123");
    expect(mockResponse.state.status).toBe(200);
  });
});
