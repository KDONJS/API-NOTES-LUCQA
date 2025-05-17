const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Cargar el archivo YAML de Swagger
const swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API de Notas - Documentación',
    customfavIcon: '/favicon.ico'
  })
};