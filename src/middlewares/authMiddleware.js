const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.usuario = await User.findById(decoded.id).select('-password');

      if (!req.usuario) {
        logger.warn(`Intento de acceso con token válido pero usuario no existente: ${decoded.id}`);
        return res.status(401).json({ message: 'No autorizado, token inválido' });
      }

      next();
    } catch (error) {
      logger.error(`Error de autenticación: ${error.message}`);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    logger.warn(`Intento de acceso a ruta protegida sin token: ${req.originalUrl}`);
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar rol de admin
const admin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    logger.warn(`Intento de acceso a ruta de admin por usuario no autorizado: ${req.usuario?._id}`);
    res.status(403).json({ message: 'No autorizado como administrador' });
  }
};

module.exports = { protect, admin };