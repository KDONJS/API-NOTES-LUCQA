const Joi = require('joi');

const noteSchema = Joi.object({
  nota: Joi.string().max(1000).required(),
  categoria: Joi.string().max(100).required(),
  etiquetas: Joi.array().items(Joi.string().max(50)).default([]),
  color: Joi.string().default('#ffffff'),
  autor: Joi.string().required(),
  recordatorio: Joi.object({
    fecha: Joi.date().allow(null),
    hora: Joi.string().allow(null),
    activo: Joi.boolean()
  }).default({ fecha: null, hora: null, activo: false }),
  estado: Joi.string().valid('pendiente', 'en_progreso', 'completada', 'archivada').default('pendiente'),
  prioridad: Joi.string().valid('baja', 'media', 'alta', 'urgente').default('media'),
  fechaVencimiento: Joi.date().allow(null),
  adjuntos: Joi.array().items(Joi.string().uri()).default([]),
  colaboradores: Joi.array().items(Joi.string()).default([])
});

module.exports = { noteSchema };