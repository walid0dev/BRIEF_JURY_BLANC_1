import { sendResponse } from "../../utils/response.js";
import dashboardService from "./service.js";

const getDashboardSummary = async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.user.id);
  sendResponse(res, 200, summary);
};

export default {
  getDashboardSummary,
};
