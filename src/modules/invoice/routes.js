import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../shared/middlewares/validators.js";
import { createInvoiceSchema, getInvoicesFilterQuerySchema } from "./schemas.js";
import invoiceControllers from "./controllers.js";
import { objectIdParamSchema } from "../../utils/validators.js";
import { requireToken , authenticate } from "../../shared/middlewares/auth.js";

const router = Router();

router.use(requireToken, authenticate);

router.get(
  "/",
  validateQuery(getInvoicesFilterQuerySchema),
  invoiceControllers.getInvoices,
);

router.get("/:id", validateParams(objectIdParamSchema), invoiceControllers.getInvoice);

router.post("/", validateBody(createInvoiceSchema), invoiceControllers.createInvoice);

router.put("/:id", validateParams(objectIdParamSchema), validateBody(createInvoiceSchema), invoiceControllers.updateInvoice);

router.delete("/:id", validateParams(objectIdParamSchema), invoiceControllers.deleteInvoice);



export default router;