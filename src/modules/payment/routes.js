import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validators.js";
import { createPaymentSchema } from "./schemas.js";
import { objectIdParamSchema } from "../../utils/validators.js";
import paymentController from "./controllers.js";
const router = Router();
router.post(
  "/:id/payments",
  validateParams(objectIdParamSchema),
  validateBody(createPaymentSchema),
  paymentController.createPayment,
);
router.get(
  "/:id/payments",
  validateParams(objectIdParamSchema),
  paymentController.getInvoicePayments,
);

export default router;
