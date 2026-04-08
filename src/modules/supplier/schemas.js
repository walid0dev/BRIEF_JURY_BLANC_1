import Joi from "joi";

export const createSupplierSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
	contact: Joi.string(),
});

export const updateSupplierSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string(),
	address: Joi.string(),
	contact: Joi.string(),
}).min(1);
