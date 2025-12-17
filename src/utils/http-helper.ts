import { HttpResponse } from "../models/http-response";

export const ok = async (data: any): Promise<HttpResponse> => {
  return {
    statusCode: 200,
    body: data,
  };
};

export const created = async (data?: any): Promise<HttpResponse> => {
  return {
    statusCode: 201,
    body: data || { message: "successful" },
  };
};

export const noContent = async (): Promise<HttpResponse> => {
  return {
    statusCode: 204,
    body: null,
  };
};

export const badRequest = async (data?: any): Promise<HttpResponse> => {
  return {
    statusCode: 400,
    body: data || null,
  };
};

export const conflict = async (data?: any): Promise<HttpResponse> => {
  return {
    statusCode: 409,
    body: data || { message: "Conflict" },
  };
};

export const serverError = async (data?: any): Promise<HttpResponse> => {
  return {
    statusCode: 500,
    body: data || { message: "Internal Server Error" },
  };
};
