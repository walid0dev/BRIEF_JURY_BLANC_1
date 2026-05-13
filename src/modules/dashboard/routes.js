import { Router } from "express";
import dashboardController from "./controllers.js";
import { authenticate, requireToken } from "../../shared/middlewares/auth.js";

const router = Router();

router.use(requireToken, authenticate);
router.get("/", dashboardController.getDashboardSummary);

export default router;
