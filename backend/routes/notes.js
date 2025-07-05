import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/authenticateToken.js';//tjis middleware checks if the user is authenticated by verifying the JWT token and attaches user info to the request object
import { body, validationResult } from 'express-validator';
import Note from '../models/Note.js';

//ROUTE 1 : Get all notes for a user using GET /api/notes/fetchallnotes. Login required
router.get('/fetchallnotes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId }); // Fetch notes for the authenticated user
        res.status(200).json({ message: 'Notes fetched successfully', notes });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


//ROUTE 2 : Add a new note using POST /api/notes/addnote. Login required
router.post('/addnote', authenticateToken, [
    // Note title validation
    body('title')
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters'),

    // Note description validation
    body('description')
        .isLength({ min: 5})
        .withMessage('Description must be between 5 and 500 characters')

], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return res.status(400).json({ message: errorMessages });
        }
        const { title, tag, description } = req.body;
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.userId // Attach the user ID from the authenticated token
        });
        const savedNote = await note.save();
        res.status(201).json({ message: 'Note added successfully', note: savedNote });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})


//ROUTE 3 : Update an existing notes using PUT /api/notes/updatenote/:id. Login required
router.put('/updatenote/:id', authenticateToken, [
    // Note title validation if provided
    body('title')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters'),

    // Note description validation if provided
    body('description')
        .optional()
        .isLength({ min: 5, max: 500 })
        .withMessage('Description must be between 5 and 500 characters')

], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return res.status(400).json({ message: errorMessages });
        }

        //Create a newnote object
        let newNote = {};
        const { title, description, tag } = req.body;
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        //Find the note by ID 
        const noteId = req.params.id;
        let note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the note belongs to the authenticated user
        if (note.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied, you can only update your own notes' });
        }

        // Update the note with new values
        const updatedNote = await Note.findByIdAndUpdate(noteId, { $set: newNote }, { new: true });
        res.status(200).json({ message: 'Note updated successfully', note: updatedNote });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


//ROUTE 4 : Delete an existing note using DELETE /api/notes/deletenote/:id. Login required
router.delete('/deletenote/:id', authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        // Check if the note belongs to the authenticated user
        if (note.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied, you can only delete your own notes' });
        }
        await Note.findByIdAndDelete(noteId);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default router;