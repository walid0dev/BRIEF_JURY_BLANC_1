import { Router } from "express";
import { createSupplierSchema, updateSupplierSchema } from "./schemas.js";
import { authenticate, requireToken } from "../../shared/middlewares/auth.js";
import { validateBody, validateParams } from "../../shared/middlewares/validators.js";
import supplierControllers from "./controllers.js";
import { objectIdParamSchema } from "../../utils/validators.js";

const router = Router();
router.use(requireToken, authenticate);
router.get("/", supplierControllers.getAllSuppliers);
router.get("/:id",
  validateParams(objectIdParamSchema),
  supplierControllers.getSupplierById);
router.post(
  "/",
  validateBody(createSupplierSchema),
  supplierControllers.createSupplier,
);
router.put(
  "/:id",
  validateParams(objectIdParamSchema),
  validateBody(updateSupplierSchema),
  supplierControllers.updateSupplier,
);
router.delete("/:id",
  validateParams(objectIdParamSchema),
  supplierControllers.deleteSupplier);

export default router;