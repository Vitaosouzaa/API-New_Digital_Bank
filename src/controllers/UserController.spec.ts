import { Request } from "express";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserService } from "../services/UserService";
import { UserController } from "./UserController";

describe("UserController", () => {
  const mockUserService: Partial<UserService> = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
  };
  const userController = new UserController(mockUserService as UserService);
  const mockResponse = makeMockResponse();

  it("Deve adicionar um novo usuario", () => {
    const mockRequest = makeMockRequest({
      body: { name: "João", email: "joao@email.com" },
    });
    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(201);
    expect(mockResponse.state.json).toMatchObject({ message: "User created!" });
  });

  it("Deve retornar erro ao tentar adicionar um usuário sem email", () => {
    const mockRequest = makeMockRequest({
      body: { name: "João", email: "" },
    });
    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request: Email Obrigatório",
    });
  });

  it("Deve retornar a lista de usuários", () => {
    const mockRequest = makeMockRequest({});
    userController.getAllUsers(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(200);
  });

  it("Deve retornar uma mensagem de usuário deletado", () => {
    const mockRequest = {
      body: {
        id: 1,
        email: "",
      },
    } as Request;

    userController.deleteUser(mockRequest, mockResponse);

    expect(mockResponse.state.status).toBe(200);
    expect(mockResponse.state.json).toMatchObject({ message: "User deleted!" });
  });
});
