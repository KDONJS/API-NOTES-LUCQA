const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    nota: {
      type: String,
      required: [true, 'Por favor ingresa el contenido de la nota'],
    },
    categoria: {
      type: String,
      required: [true, 'Por favor ingresa la categoría de la nota'],
    },
    etiquetas: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: '#ffffff',
    },
    autor: {
      type: String,
      required: [true, 'Por favor ingresa el autor de la nota'],
    },
    recordatorio: {
      fecha: {
        type: Date,
        default: null,
      },
      hora: {
        type: String,
        default: null,
      },
      activo: {
        type: Boolean,
        default: false,
      },
    },
    // Nuevo campo para el estado de la nota
    estado: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'completada', 'archivada'],
      default: 'pendiente',
    },
    // Campo para prioridad
    prioridad: {
      type: String,
      enum: ['baja', 'media', 'alta', 'urgente'],
      default: 'media',
    },
    // Campo para fecha de vencimiento
    fechaVencimiento: {
      type: Date,
      default: null,
    },
    // Campo para adjuntos (URLs o referencias a archivos)
    adjuntos: {
      type: [String],
      default: [],
    },
    // Campo para colaboradores (si la nota es compartida)
    colaboradores: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;