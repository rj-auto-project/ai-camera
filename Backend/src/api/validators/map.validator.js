import Joi from "joi";

const operationSchema = Joi.object({
  cameras: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        location: Joi.object({
          lat: Joi.number().required(),
          long: Joi.number().required(),
        }),
        status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
      }),
    )
    .required(),
  operation_type: Joi.object({
    ANPR: Joi.object({
      license_plate_number: Joi.string().optional(),
      color_of_vehicle: Joi.string().required(),
      vehicle_type: Joi.string().required(),
    }).optional(),
    Face_detection: Joi.object({
      image: Joi.string().required(),
    }).optional(),
    suspect_search: Joi.object({
      image: Joi.string().required(),
    }).optional(),
    crowd_restriction: Joi.object({
      limit: Joi.number().required(),
    }).optional(),
    vehicle_restriction: Joi.object({
      limit: Joi.number().required(),
    }).optional(),
    vehicle_search: Joi.object({
      license_plate_number: Joi.string().optional(),
      color_of_vehicle: Joi.string().required(),
      vehicle_type: Joi.string().required(),
    }).optional(),
  }).required(),
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

const operationValidator = validate(operationSchema);

export { operationValidator };
