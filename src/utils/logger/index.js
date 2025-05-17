const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio de logs existe
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para consola
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaString = Object.keys(metadata).length 
    ? `\n${JSON.stringify(metadata, null, 2)}` 
    : '';
  
  return `[${timestamp}] ${level}: ${message}${metaString}`;
});

// Configuración de rotación de archivos
const fileRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDir, 'api-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(
    timestamp(),
    json()
  )
});

// Crear el logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'api-notes' },
  transports: [
    // Escribir logs a la consola
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      )
    }),
    // Escribir logs a archivos rotados
    fileRotateTransport
  ],
  exitOnError: false
});

// Niveles de log personalizados
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

module.exports = logger;