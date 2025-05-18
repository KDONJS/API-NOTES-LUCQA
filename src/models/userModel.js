const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    nombre: {
      type: String,
      required: [true, 'Por favor ingresa tu nombre'],
    },
    apellidos: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Por favor ingresa tu email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingresa un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor ingresa una contraseña'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    telefono: {
      type: String,
      default: '',
    },
    foto: {
      type: String,
      default: '',
    },
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
    status: {
      type: String,
      enum: ['activo', 'inactivo', 'suspendido'],
      default: 'activo',
    },
    empresa: {
      type: String,
      default: '',
    },
    equipo: {
      type: String,
      default: '',
    },
    activo: {
      type: Boolean,
      default: true,
    },
    ultimoAcceso: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;