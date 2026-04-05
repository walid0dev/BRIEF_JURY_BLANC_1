import type { Response } from "express";

export interface ApiResponse<T> {
  status: "success";
  results?: number;
  data?: T;
  message?: string | undefined;
}


export const sendResponse = <T>(
  res: Response,
  statusCode: number = 200,
  data: T,
  message?: string,
): Response => {
  const responseBody: ApiResponse<T> = {
    status: "success",
    message,
    // If data is an array, automatically include a 'results' count
    ...(Array.isArray(data) && { results: data.length }),
    data,
  };

  return res.status(statusCode).json(responseBody);
};
