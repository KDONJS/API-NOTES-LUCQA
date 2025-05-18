const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');

// @desc    Registrar un nuevo usuario
// @route   POST /api/users
// @access  Público
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, rol, telefono, foto, empresa, equipo } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      logger.warn(`Intento de registro con email ya existente: ${email}`);
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const usuario = await User.create({
      nombre,
      apellidos,
      email,
      password,
      telefono,
      foto,
      empresa,
      equipo,
      rol: rol && req.body.isAdmin ? rol : 'usuario',
    });

    if (usuario) {
      logger.info(`Nuevo usuario registrado: ${email}`);
      res.status(201).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        foto: usuario.foto,
        empresa: usuario.empresa,
        equipo: usuario.equipo,
        status: usuario.status,
        rol: usuario.rol,
        token: generateToken(usuario._id),
      });
    } else {
      logger.error('Error al crear usuario: datos inválidos');
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    logger.error(`Error al registrar usuario: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Público
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await User.findOne({ email }).select('+password');

    if (!usuario) {
      logger.warn(`Intento de login con email no existente: ${email}`);
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar si la contraseña es correcta
    const passwordCorrecta = await usuario.compararPassword(password);

    if (!passwordCorrecta) {
      logger.warn(`Intento de login con contraseña incorrecta para: ${email}`);
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Actualizar último acceso
    usuario.ultimoAcceso = Date.now();
    await usuario.save({ validateBeforeSave: false });

    logger.info(`Usuario autenticado: ${email}`);
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token: generateToken(usuario._id),
    });
  } catch (error) {
    logger.error(`Error al autenticar usuario: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener perfil de usuario
// @route   GET /api/users/perfil
// @access  Privado
const obtenerPerfilUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);

    if (usuario) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        telefono: usuario.telefono,
        foto: usuario.foto,
        empresa: usuario.empresa,
        equipo: usuario.equipo,
        status: usuario.status,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
        ultimoAcceso: usuario.ultimoAcceso,
      });
    } else {
      logger.warn(`Intento de acceso a perfil no existente: ${req.usuario._id}`);
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al obtener perfil de usuario: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/perfil
// @access  Privado
const actualizarPerfilUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);

    if (usuario) {
      usuario.nombre = req.body.nombre || usuario.nombre;
      usuario.apellidos = req.body.apellidos || usuario.apellidos;
      usuario.email = req.body.email || usuario.email;
      usuario.telefono = req.body.telefono || usuario.telefono;
      usuario.foto = req.body.foto || usuario.foto;
      usuario.empresa = req.body.empresa || usuario.empresa;
      usuario.equipo = req.body.equipo || usuario.equipo;
      
      // Ya no actualizamos la contraseña en este endpoint
      
      const usuarioActualizado = await usuario.save();

      logger.info(`Perfil actualizado para usuario: ${usuario.email}`);
      res.json({
        _id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        apellidos: usuarioActualizado.apellidos,
        email: usuarioActualizado.email,
        telefono: usuarioActualizado.telefono,
        foto: usuarioActualizado.foto,
        empresa: usuarioActualizado.empresa,
        equipo: usuarioActualizado.equipo,
        status: usuarioActualizado.status,
        rol: usuarioActualizado.rol,
        token: generateToken(usuarioActualizado._id),
      });
    } else {
      logger.warn(`Intento de actualización de perfil no existente: ${req.usuario._id}`);
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al actualizar perfil de usuario: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cambiar contraseña de usuario
// @route   PUT /api/users/cambiar-password
// @access  Privado
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    
    if (!passwordActual || !nuevaPassword) {
      return res.status(400).json({ 
        message: 'Se requiere la contraseña actual y la nueva contraseña' 
      });
    }
    
    const usuario = await User.findById(req.usuario._id).select('+password');
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar que la contraseña actual sea correcta
    const passwordCorrecta = await usuario.compararPassword(passwordActual);
    
    if (!passwordCorrecta) {
      logger.warn(`Intento de cambio de contraseña con contraseña actual incorrecta: ${usuario.email}`);
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }
    
    // Actualizar la contraseña
    usuario.password = nuevaPassword;
    await usuario.save();
    
    logger.info(`Contraseña actualizada para usuario: ${usuario.email}`);
    res.json({ message: 'Contraseña actualizada correctamente' });
    
  } catch (error) {
    logger.error(`Error al cambiar contraseña: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Privado/Admin
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({});
    res.json(usuarios);
  } catch (error) {
    logger.error(`Error al obtener lista de usuarios: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Privado/Admin
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (usuario) {
      await usuario.deleteOne();
      logger.info(`Usuario eliminado: ${usuario.email}`);
      res.json({ message: 'Usuario eliminado' });
    } else {
      logger.warn(`Intento de eliminación de usuario no existente: ${req.params.id}`);
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    logger.error(`Error al eliminar usuario: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Inicializar el primer usuario administrador
// @route   POST /api/users/init-admin
// @access  Público (solo funciona si no hay usuarios admin)
const inicializarAdmin = async (req, res) => {
  try {
    // Verificar si ya existe algún usuario con rol de admin
    const adminExistente = await User.findOne({ rol: 'admin' });

    if (adminExistente) {
      logger.warn(`Intento de inicializar admin cuando ya existe uno`);
      return res.status(400).json({ 
        message: 'Ya existe un usuario administrador en el sistema' 
      });
    }

    const { nombre, apellidos, email, password, telefono, foto, empresa, equipo } = req.body;

    // Verificar datos mínimos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: 'Se requieren al menos nombre, email y contraseña' 
      });
    }

    // Verificar si el email ya está en uso
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ 
        message: 'El email ya está en uso' 
      });
    }

    // Crear el usuario administrador
    const admin = await User.create({
      nombre,
      apellidos: apellidos || '',
      email,
      password,
      telefono: telefono || '',
      foto: foto || '',
      empresa: empresa || '',
      equipo: equipo || '',
      rol: 'admin',
      status: 'activo'
    });

    if (admin) {
      logger.info(`Primer usuario administrador creado: ${email}`);
      res.status(201).json({
        _id: admin._id,
        nombre: admin.nombre,
        apellidos: admin.apellidos,
        email: admin.email,
        rol: admin.rol,
        token: generateToken(admin._id),
        message: 'Usuario administrador inicializado correctamente'
      });
    } else {
      logger.error('Error al crear usuario administrador: datos inválidos');
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    logger.error(`Error al inicializar administrador: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  cambiarPassword,
  inicializarAdmin,
};