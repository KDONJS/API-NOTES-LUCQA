/**
 * Middleware de validación reutilizable usando Joi
 * Valida el cuerpo de la petición y elimina propiedades no definidas en el esquema
 * 
 * @param {Object} schema - Esquema de Joi a utilizar
 * @returns Middleware Express
 */

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
      allowUnknown: false
    });
  
    if (error) {
      return res.status(400).json({
        message: 'Validación fallida',
        errors: error.details.map(e => e.message)
      });
    }
  
    req.validatedBody = value;
    next();
  };
  
  module.exports = validate;