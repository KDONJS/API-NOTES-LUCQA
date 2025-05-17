const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const validate = require('../middlewares/validate');
const { noteSchema } = require('../validators/noteValidator');

router.route('/').get(getNotes).post(validate(noteSchema), createNote);

router.route('/:id').get(getNoteById).put(validate(noteSchema), updateNote).delete(deleteNote);

module.exports = router;