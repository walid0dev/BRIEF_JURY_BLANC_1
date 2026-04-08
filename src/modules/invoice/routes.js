import { Router } from "express";
import invoiceService from "./service.js";
import { BadRequestError } from "../../utils/errors.js";    



const router = Router();