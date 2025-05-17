const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones de configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Notas',
      version: '1.0.0',
      description: 'API para gestionar notas con recordatorios',
      contact: {
        name: 'Soporte API',
        email: 'soporte@api-notas.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  // Incluir los archivos de documentación Swagger
  apis: [
    './src/docs/swagger/*.js',
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

// Inicializar Swagger
const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API de Notas - Documentación',
    customfavIcon: '/favicon.ico'
  })
};