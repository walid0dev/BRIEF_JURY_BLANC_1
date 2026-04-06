import catchAsync from "@/utils/catchAsync.ts";
import { sendResponse } from "@/utils/response.ts";

export const profile = catchAsync(async (req, res) => {
  const user = req.user;
  sendResponse(res, 200, user, "current user");
});
