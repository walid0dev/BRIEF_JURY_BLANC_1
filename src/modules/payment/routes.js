import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validators.js";
import { createPaymentSchema } from "./schemas.js";
import { objectIdParamSchema } from "../../utils/validators.js";
import paymentController from "./controllers.js";
import { authenticate,requireToken } from "../../shared/middlewares/auth.js";
const router = Router();
router.use(requireToken, authenticate);
router.post(
  "/:id",
  validateParams(objectIdParamSchema),
  validateBody(createPaymentSchema),
  paymentController.createPayment,
);
router.get(
  "/:id",
  validateParams(objectIdParamSchema),
  paymentController.getInvoicePayments,
);

export default router;
