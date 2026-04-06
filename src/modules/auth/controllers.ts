import catchAsync from "@/utils/catchAsync.ts";
import { sendResponse } from "@/utils/response.ts";
import type { RequestHandler } from "express";

export const profile : RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  sendResponse(res, 200, user, "current user");
});
