import Joi from "joi";
import {isObjectIdOrHexString} from "mongoose"
export const objectIdParamSchema = Joi.object({
    id: Joi.string().custom((value, helpers) => {
		if (!isObjectIdOrHexString(value)) {
			return helpers.error("any.invalid");
		}
		return value;
	}).required(),
});	