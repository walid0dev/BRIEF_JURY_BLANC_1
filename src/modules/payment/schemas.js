import Joi from "joi";
import { objectIdParamSchema } from "../../utils/validators.js";

export const createPaymentSchema = Joi.object({
    amount: Joi.number().min(0).required(),
    note: Joi.string().optional(),
    invoiceId: objectIdParamSchema
});