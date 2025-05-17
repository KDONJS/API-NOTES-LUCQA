const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const figlet = require('figlet');
const Table = require('cli-table3');
const colors = require('colors');

// Cargar variables de entorno
dotenv.config();

// Configuración de la aplicación
const APP_NAME = 'API de Notas';
const VERSION = '1.0.0';
const TECH = 'Node.js + Express';
const DB = 'MongoDB';
const PORT = process.env.PORT || 3000;

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
  ['Puerto'.cyan, PORT.toString()]
);

console.log(table.toString());

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/api/notes', noteRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('API de Notas está funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`.green.bold);
});