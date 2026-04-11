import { Router } from "express";
import { createSupplierSchema, updateSupplierSchema } from "./schemas.js";
import { authenticate, requireToken } from "../../shared/middlewares/auth.js";
import { validateBody } from "../../shared/middlewares/validators.js";
import supplierControllers from "./controllers.js";

const router = Router();

router.use(requireToken, authenticate);
router.get("/", supplierControllers.getAllSuppliers);
router.get("/:id", supplierControllers.getSupplierById);
router.post(
  "/",
  validateBody(createSupplierSchema),
  supplierControllers.createSupplier,
);
router.put(
  "/:id",
  validateBody(updateSupplierSchema),
  supplierControllers.updateSupplier,
);
router.delete("/:id", supplierControllers.deleteSupplier);

export default router;