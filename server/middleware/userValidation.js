import Joi from "joi";

export const authValidate = (req, res, next) => {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
      .required()
  });

  const { error, value } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const clubValidate = (req, res, next) => {
  const { name } = req.body;
  const schema = Joi.object({
    name: Joi.string()
      .required(),
  });

  const { error, value } = schema.validate({ name });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};