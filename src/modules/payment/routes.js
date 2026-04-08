import { Router } from "express";
import {
  validateBody,
} from "../../shared/middlewares/validators.js";
import { createPaymentSchema} from "./schemas.js";

const router = Router();
router.post("/:id/payments", validateBody(createPaymentSchema))
router.get("/:id/payments")

export default router;