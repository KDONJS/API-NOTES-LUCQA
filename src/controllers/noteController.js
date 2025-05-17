const Note = require('../models/noteModel');

// Obtener todas las notas
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({});
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una nota por ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva nota
const createNote = async (req, res) => {
  try {
    // Validar y sanitizar los datos de entrada
    const validatedData = {
      nota: req.body.nota ? req.body.nota.trim() : null,
      categoria: req.body.categoria ? req.body.categoria.trim() : null,
      etiquetas: Array.isArray(req.body.etiquetas) ? req.body.etiquetas.map(tag => tag.trim()) : [],
      color: req.body.color ? req.body.color.trim() : '#ffffff',
      autor: req.body.autor ? req.body.autor.trim() : null,
      recordatorio: {
        fecha: req.body.recordatorio?.fecha || null,
        hora: req.body.recordatorio?.hora ? req.body.recordatorio.hora.trim() : null,
        activo: !!req.body.recordatorio?.activo
      },
      estado: ['pendiente', 'en_progreso', 'completada', 'archivada'].includes(req.body.estado) 
        ? req.body.estado 
        : 'pendiente',
      prioridad: ['baja', 'media', 'alta', 'urgente'].includes(req.body.prioridad) 
        ? req.body.prioridad 
        : 'media',
      fechaVencimiento: req.body.fechaVencimiento || null,
      adjuntos: Array.isArray(req.body.adjuntos) ? req.body.adjuntos.map(url => url.trim()) : [],
      colaboradores: Array.isArray(req.body.colaboradores) ? req.body.colaboradores.map(col => col.trim()) : []
    };

    // Verificar campos obligatorios
    if (!validatedData.nota) {
      return res.status(400).json({ message: 'El contenido de la nota es obligatorio' });
    }
    if (!validatedData.categoria) {
      return res.status(400).json({ message: 'La categoría de la nota es obligatoria' });
    }
    if (!validatedData.autor) {
      return res.status(400).json({ message: 'El autor de la nota es obligatorio' });
    }

    // Crear la nota con los datos validados de manera más segura
    const newNote = new Note({
      nota: validatedData.nota,
      categoria: validatedData.categoria,
      etiquetas: validatedData.etiquetas,
      color: validatedData.color,
      autor: validatedData.autor,
      recordatorio: {
        fecha: validatedData.recordatorio.fecha,
        hora: validatedData.recordatorio.hora,
        activo: validatedData.recordatorio.activo
      },
      estado: validatedData.estado,
      prioridad: validatedData.prioridad,
      fechaVencimiento: validatedData.fechaVencimiento,
      adjuntos: validatedData.adjuntos,
      colaboradores: validatedData.colaboradores
    });
    
    const note = await newNote.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una nota
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    // Validar y sanitizar los datos de entrada
    const validatedData = {};
    
    // Solo incluir campos que están presentes en la solicitud
    if (req.body.nota !== undefined) validatedData.nota = req.body.nota.trim();
    if (req.body.categoria !== undefined) validatedData.categoria = req.body.categoria.trim();
    if (req.body.etiquetas !== undefined) {
      validatedData.etiquetas = Array.isArray(req.body.etiquetas) 
        ? req.body.etiquetas.map(tag => tag.trim()) 
        : note.etiquetas;
    }
    if (req.body.color !== undefined) validatedData.color = req.body.color.trim();
    if (req.body.autor !== undefined) validatedData.autor = req.body.autor.trim();
    
    if (req.body.recordatorio !== undefined) {
      validatedData.recordatorio = {
        fecha: req.body.recordatorio.fecha || note.recordatorio.fecha,
        hora: req.body.recordatorio.hora ? req.body.recordatorio.hora.trim() : note.recordatorio.hora,
        activo: req.body.recordatorio.activo !== undefined ? !!req.body.recordatorio.activo : note.recordatorio.activo
      };
    }
    
    if (req.body.estado !== undefined) {
      validatedData.estado = ['pendiente', 'en_progreso', 'completada', 'archivada'].includes(req.body.estado) 
        ? req.body.estado 
        : note.estado;
    }
    
    if (req.body.prioridad !== undefined) {
      validatedData.prioridad = ['baja', 'media', 'alta', 'urgente'].includes(req.body.prioridad) 
        ? req.body.prioridad 
        : note.prioridad;
    }
    
    if (req.body.fechaVencimiento !== undefined) validatedData.fechaVencimiento = req.body.fechaVencimiento;
    
    if (req.body.adjuntos !== undefined) {
      validatedData.adjuntos = Array.isArray(req.body.adjuntos) 
        ? req.body.adjuntos.map(url => url.trim()) 
        : note.adjuntos;
    }
    
    if (req.body.colaboradores !== undefined) {
      validatedData.colaboradores = Array.isArray(req.body.colaboradores) 
        ? req.body.colaboradores.map(col => col.trim()) 
        : note.colaboradores;
    }

    // Actualizar la nota con los datos validados
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una nota
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};