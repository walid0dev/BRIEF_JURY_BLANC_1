import Joi from 'joi';
import {isObjectIdOrHexString} from "mongoose"
import { objectIdParamSchema } from "../../utils/validators.js";

export const createInvoiceSchema = Joi.object({
    supplierId: Joi.string().custom((value, helpers) => {
        if (!isObjectIdOrHexString(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }).required(),
    amount: Joi.number().positive().required(),
    dueDate: Joi.date().iso().required(),
    description: Joi.string().max(254).optional(),
});


export const updateInvoiceSchema = Joi.object({
    amount: Joi.number().positive().optional(),
    dueDate: Joi.date().iso().optional(),
    description: Joi.string().max(254).optional(),
    status: Joi.string().valid("paid", "partially_paid", "unpaid").optional()

}).min(1); 


export const getInvoicesFilterQuerySchema = Joi.object({
    supplierId: objectIdParamSchema,
    status: Joi.string().valid("paid", "partially_paid", "unpaid").optional(),
    page: Joi.number().integer().positive().optional().default(1),
    limit: Joi.number().integer().positive().optional().default(15),
}).with('page', 'limit');
