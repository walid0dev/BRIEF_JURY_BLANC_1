// import Joi from "joi";
// import { objectIdParamSchema } from "../../utils/validators.js";

// export const createPaymentSchema = Joi.object({
//     amount: Joi.number().min(0).required(),
//     note: Joi.string().optional(),
//     invoiceId: objectIdParamSchema
// });
import Joi from "joi";

export const createPaymentSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  note: Joi.string().optional(),
  invoiceId: Joi.string().hex().length(24).required(),
});