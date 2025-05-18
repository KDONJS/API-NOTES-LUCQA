const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  cambiarPassword,
  inicializarAdmin,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', loginUsuario);
router.post('/init-admin', inicializarAdmin);

// Rutas protegidas para usuarios
router.route('/')
  .post(protect, admin, registrarUsuario)
  .get(protect, admin, obtenerUsuarios);

router.route('/perfil')
  .get(protect, obtenerPerfilUsuario)
  .put(protect, actualizarPerfilUsuario);

// Ruta para cambiar contraseña
router.put('/cambiar-password', protect, cambiarPassword);

// Rutas protegidas para administradores
router.route('/:id')
  .delete(protect, admin, eliminarUsuario);

module.exports = router;