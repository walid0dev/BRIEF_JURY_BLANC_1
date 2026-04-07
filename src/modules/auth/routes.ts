import { Router } from "express";
import authController from "./controllers.ts";
import { authenticate, requireToken } from "@shared/middlewares/auth.ts";
import { validateBody } from "@/shared/middlewares/validators.ts";
import {userCreateSchema , userLoginSchema} from "./schemas.ts";
const router = Router();

router.get("/me" , requireToken, authenticate, authController.profile);
router.post("/register", validateBody(userCreateSchema) , authController.register);
router.post("/login", validateBody(userLoginSchema), authController.login);


export default router;