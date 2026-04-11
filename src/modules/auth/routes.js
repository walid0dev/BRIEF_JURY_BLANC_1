import { Router } from "express";
import authController from "./controllers.js";
import { authenticate, requireToken } from "../../shared/middlewares/auth.js";
import { validateBody } from "../../shared/middlewares/validators.js";
import { userCreateSchema, userLoginSchema } from "./schemas.js";
const router = Router();
router.get("/me", requireToken, authenticate, authController.profile);
router.post("/register", validateBody(userCreateSchema), authController.register);
router.post("/login", validateBody(userLoginSchema), authController.login);


export default router


