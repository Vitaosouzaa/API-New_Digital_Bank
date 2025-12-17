import { Params } from "express-serve-static-core";
import { Request } from "express";

export const makeMockRequest = ({
  params,
  query,
  body,
}: {
  params?: Params;
  query?: Params;
  body?: object;
}): Request => {
  const request = {
    params: params || {},
    query: query || {},
    body: body || {},
  } as unknown;

  return request as Request;
};
