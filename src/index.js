const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const figlet = require('figlet');
const Table = require('cli-table3');
const colors = require('colors');
const logger = require('./utils/logger');
const httpLogger = require('./middlewares/logs/httpLogger');
const errorLogger = require('./middlewares/logs/errorLogger');
const swaggerConfig = require('./config/swagger');

// Cargar variables de entorno
dotenv.config();

// Configuración de la aplicación
const APP_NAME = 'API de Notas';
const VERSION = '1.0.0';
const TECH = 'Node.js + Express';
const DB = 'MongoDB';
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Mostrar banner
console.log(
  figlet.textSync('API de Notas', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }).green
);

// Crear tabla informativa
const table = new Table({
  head: ['Propiedad'.yellow, 'Valor'.yellow],
  colWidths: [20, 50]
});

table.push(
  ['Nombre'.cyan, APP_NAME],
  ['Versión'.cyan, VERSION],
  ['Tecnología'.cyan, TECH],
  ['Base de Datos'.cyan, DB],
  ['Puerto'.cyan, PORT.toString()],
  ['Entorno'.cyan, NODE_ENV],
  ['Documentación'.cyan, `http://localhost:${PORT}/api-docs`]
);

console.log(table.toString());

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware de seguridad
app.use(helmet());

// Permitir que Swagger funcione con Helmet de manera más segura
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    // Prevenir contenido mixto
    upgradeInsecureRequests: [],
    // Restringir conexiones solo a HTTPS
    blockAllMixedContent: []
  }
}));

// Middleware de logs HTTP
app.use(httpLogger);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la API
app.use('/api/notes', noteRoutes);

// Ruta de documentación Swagger
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// Ruta de inicio
app.get('/', (req, res) => {
  res.send(`
    <h1>API de Notas</h1>
    <p>La API está funcionando correctamente.</p>
    <p><a href="/api-docs">Ver documentación de la API</a></p>
  `);
});

// Middleware para manejo de errores
app.use(errorLogger);

// Middleware para rutas no encontradas
app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    requestId: req.id
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en el puerto ${PORT} en modo ${NODE_ENV}`);
  logger.info(`Documentación disponible en http://localhost:${PORT}/api-docs`);
  console.log(`Servidor corriendo en puerto ${PORT}`.green.bold);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
  logger.error('Excepción no capturada:', err);
  process.exit(1);
});

// Manejo de promesas rechazadas no capturadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no capturada:', { reason, promise });
  process.exit(1);
});