import joi from "joi";

const authSchema = joi.object({
  email: joi.string().lowercase().email().required(),
  password: joi.string().min(8).required(),
  confirmPassword: joi.ref("password"),
});

export default authSchema;
