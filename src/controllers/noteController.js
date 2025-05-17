const Note = require('../models/noteModel');
const { noteSchema } = require('../validators/noteValidator');

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

// Crear una nueva nota usando el body ya validado y sanitizado
const createNote = async (req, res) => {
  try {
    const note = new Note(req.validatedBody);
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una nota usando el body validado y sanitizado
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    // Actualizar con el cuerpo validado
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.validatedBody, {
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