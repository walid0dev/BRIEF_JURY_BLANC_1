import Joi from "joi";
const userCreateSchema = Joi.object({
  name: Joi.string().min(8).max(128).required(),
  email: Joi.string().min(8).max(254).email().required(),
  password: Joi.string().min(8).max(128).required(),
  password_confirmation: Joi.string().valid(Joi.ref("password")).required()
}).with("password", "password_confirmation");
const userLoginSchema = Joi.object({
  email: Joi.string().min(8).max(254).email().required(),
  password: Joi.string().min(8).max(128).required()
});
export {
  userCreateSchema,
  userLoginSchema
};
