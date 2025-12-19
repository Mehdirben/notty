import express from 'express';
import { body, validationResult } from 'express-validator';
import xml2js from 'xml2js';
import Note from '../models/Note.js';
import Notebook from '../models/Notebook.js';
import { protect } from '../middleware/auth.js';
import { validateXML, getSchemaContent } from '../utils/xmlValidator.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// XML Builder and Parser
const xmlBuilder = new xml2js.Builder({ rootName: 'note', headless: true });
const xmlParser = new xml2js.Parser();

// @route   GET /api/notes
// @desc    Get all notes for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { notebook, search, favorite, archived } = req.query;

    let query = { user: req.user._id };

    if (notebook) {
      query.notebook = notebook;
    }

    if (favorite === 'true') {
      query.isFavorite = true;
    }

    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const notes = await Note.find(query)
      .populate('notebook', 'title color icon')
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    // Validate that the ID is a valid MongoDB ObjectId format
    const { id } = req.params;

    // Check if id is a valid ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, user: req.user._id })
      .populate('notebook', 'title color icon');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notes/:id/xml
// @desc    Get note content as XML
// @access  Private
router.get('/:id/xml', async (req, res) => {
  try {
    // Validate that the ID is a valid MongoDB ObjectId format
    const { id } = req.params;

    // Check if id is a valid ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.set('Content-Type', 'application/xml');
    res.send(note.contentXML);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notes/schema
// @desc    Get the XSD schema for note XML
// @access  Public (schema is documentation)
router.get('/schema', (req, res) => {
  try {
    const schemaContent = getSchemaContent();
    res.set('Content-Type', 'application/xml');
    res.set('Content-Disposition', 'attachment; filename="note.xsd"');
    res.send(schemaContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve schema' });
  }
});

// @route   POST /api/notes
// @desc    Create a note
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('notebook').notEmpty().withMessage('Notebook is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, notebook, tags, coverImage } = req.body;

    // Verify notebook belongs to user
    const notebookExists = await Notebook.findOne({ _id: notebook, user: req.user._id });
    if (!notebookExists) {
      return res.status(404).json({ message: 'Notebook not found' });
    }

    // Generate XML content
    const xmlContent = xmlBuilder.buildObject({
      title,
      content: content || '',
      createdAt: new Date().toISOString(),
      tags: tags || []
    });

    // Validate XML against XSD schema
    const validation = validateXML(xmlContent);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Generated XML failed XSD validation',
        errors: validation.errors
      });
    }

    const note = await Note.create({
      title,
      content,
      contentXML: xmlContent,
      notebook,
      user: req.user._id,
      tags,
      coverImage
    });

    const populatedNote = await Note.findById(note._id)
      .populate('notebook', 'title color icon');

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    // Validate that the ID is a valid MongoDB ObjectId format
    const { id } = req.params;

    // Check if id is a valid ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }

    let note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const { title, content, notebook, tags, isPinned, isFavorite, isArchived, coverImage } = req.body;

    // If changing notebook, verify new notebook belongs to user
    if (notebook && notebook !== note.notebook.toString()) {
      const notebookExists = await Notebook.findOne({ _id: notebook, user: req.user._id });
      if (!notebookExists) {
        return res.status(404).json({ message: 'Notebook not found' });
      }
    }

    // Update XML content if content changed
    let xmlContent = note.contentXML;
    if (content !== undefined) {
      xmlContent = xmlBuilder.buildObject({
        title: title || note.title,
        content: content,
        updatedAt: new Date().toISOString(),
        tags: tags || note.tags
      });

      // Validate XML against XSD schema
      const validation = validateXML(xmlContent);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Generated XML failed XSD validation',
          errors: validation.errors
        });
      }
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        contentXML: xmlContent,
        notebook,
        tags,
        isPinned,
        isFavorite,
        isArchived,
        coverImage,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('notebook', 'title color icon');

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Validate that the ID is a valid MongoDB ObjectId format
    const { id } = req.params;

    // Check if id is a valid ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notes/import-xml
// @desc    Import note from XML
// @access  Private
router.post('/import-xml', async (req, res) => {
  try {
    const { xml, notebook } = req.body;

    // Validate XML against XSD schema first
    const validation = validateXML(xml);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'XML failed XSD validation',
        errors: validation.errors
      });
    }

    // Verify notebook belongs to user
    const notebookExists = await Notebook.findOne({ _id: notebook, user: req.user._id });
    if (!notebookExists) {
      return res.status(404).json({ message: 'Notebook not found' });
    }

    // Parse XML
    const result = await xmlParser.parseStringPromise(xml);

    const note = await Note.create({
      title: result.note?.title?.[0] || 'Imported Note',
      content: result.note?.content?.[0] || '',
      contentXML: xml,
      notebook,
      user: req.user._id,
      tags: result.note?.tags || []
    });

    const populatedNote = await Note.findById(note._id)
      .populate('notebook', 'title color icon');

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to parse XML' });
  }
});

export default router;
