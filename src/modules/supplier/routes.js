const { Router } = require("express");
import {createSupplierSchema , updateSupplierSchema} from "./schemas.js";
import { authenticate, requireToken } from "../../shared/middlewares/auth.js";
import { validateBody } from "../../shared/middlewares/validators.js";


router.use(requireToken, authenticate);
router.get("/");
router.get("/:id");
router.post("/", validateBody(createSupplierSchema));
router.put("/:id", validateBody(updateSupplierSchema));
router.delete("/:id");

const router = Router();
