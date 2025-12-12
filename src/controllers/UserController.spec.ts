import { makeMockRequest } from "../__mocks__/mockRequest.mock";
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { UserService } from "../services/UserService";
import { UserController } from "./UserController";

describe("UserController", () => {
  const mockUserService: Partial<UserService> = {
    createUser: jest.fn().mockResolvedValue({ id: 1, name: "João" }),
  };
  const userController = new UserController(mockUserService as UserService);

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
      body: { name: "João" },
    });
    const mockResponse = makeMockResponse();
    userController.createUser(mockRequest, mockResponse);
    expect(mockResponse.state.status).toBe(400);
    expect(mockResponse.state.json).toMatchObject({
      message: "Bad Request: Email Obrigatório",
    });
  });
});
