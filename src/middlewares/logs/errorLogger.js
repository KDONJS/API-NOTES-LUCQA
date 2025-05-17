const logger = require('../../utils/logger');

// Middleware para capturar y registrar errores
const errorLogger = (err, req, res, next) => {
  const errorDetails = {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack
  };

  logger.error(`Error: ${err.message}`, errorDetails);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    requestId: req.id
  });
};

module.exports = errorLogger;