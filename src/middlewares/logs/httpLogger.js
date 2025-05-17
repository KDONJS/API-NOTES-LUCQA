const morgan = require('morgan');
const logger = require('../../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Crear un stream para morgan que escriba a nuestro logger
const stream = {
  write: (message) => logger.http(message.trim())
};

// Middleware para asignar un ID único a cada petición
const assignRequestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Middleware para registrar el tiempo de respuesta
const logResponseTime = (req, res, next) => {
  const startHrTime = process.hrtime();
  
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    
    logger.http({
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${elapsedTimeInMs.toFixed(2)}ms`
    });
  });
  
  next();
};

// Formato personalizado para morgan
morgan.token('id', (req) => req.id);
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('params', (req) => JSON.stringify(req.params));
morgan.token('query', (req) => JSON.stringify(req.query));

const morganFormat = ':id :method :url :status - :response-time ms';

// Middleware para registrar peticiones HTTP
const httpLogger = [
  assignRequestId,
  morgan(morganFormat, { stream }),
  logResponseTime
];

module.exports = httpLogger;