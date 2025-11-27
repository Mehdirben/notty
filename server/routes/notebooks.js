import express from 'express';
import { body, validationResult } from 'express-validator';
import Notebook from '../models/Notebook.js';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/notebooks
// @desc    Get all notebooks for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notebooks = await Notebook.find({ user: req.user._id, isArchived: false })
      .sort({ updatedAt: -1 });
    
    // Get note count for each notebook
    const notebooksWithCount = await Promise.all(
      notebooks.map(async (notebook) => {
        const noteCount = await Note.countDocuments({ notebook: notebook._id, isArchived: false });
        return { ...notebook.toObject(), noteCount };
      })
    );

    res.json(notebooksWithCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notebooks/:id
// @desc    Get single notebook
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const notebook = await Notebook.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!notebook) {
      return res.status(404).json({ message: 'Notebook not found' });
    }

    res.json(notebook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notebooks
// @desc    Create a notebook
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, color, icon } = req.body;

    const notebook = await Notebook.create({
      title,
      description,
      color,
      icon,
      user: req.user._id
    });

    res.status(201).json(notebook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notebooks/:id
// @desc    Update a notebook
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let notebook = await Notebook.findOne({ _id: req.params.id, user: req.user._id });

    if (!notebook) {
      return res.status(404).json({ message: 'Notebook not found' });
    }

    const { title, description, color, icon, isArchived } = req.body;

    notebook = await Notebook.findByIdAndUpdate(
      req.params.id,
      { title, description, color, icon, isArchived, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(notebook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notebooks/:id
// @desc    Delete a notebook
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const notebook = await Notebook.findOne({ _id: req.params.id, user: req.user._id });

    if (!notebook) {
      return res.status(404).json({ message: 'Notebook not found' });
    }

    // Delete all notes in the notebook
    await Note.deleteMany({ notebook: notebook._id });
    
    // Delete the notebook
    await notebook.deleteOne();

    res.json({ message: 'Notebook and all its notes deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
