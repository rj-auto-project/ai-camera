import Joi from "joi";
("joi");

const registerSchema = Joi.object({
  employeeId: Joi.string().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  employeeId: Joi.string().required(),
  password: Joi.string().required(),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

const registerValidator = validate(registerSchema);
const loginValidator = validate(loginSchema);

export { registerValidator, loginValidator };
