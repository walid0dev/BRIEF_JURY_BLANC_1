import Joi from "joi";
import { isObjectIdOrHexString } from "mongoose";

export const createPaymentSchema = Joi.object({
    amount: Joi.number().min(0).required(),
    note: Joi.string().optional(),
    invoiceId: Joi.string().custom((value, helpers) => {
        if (!isObjectIdOrHexString(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }, "ObjectId validation").required(),
});