const Note = require('../models/notes.js');
const express = require('express');
const crypto = require("crypto");
const mongoose = require('mongoose');
const router = express.Router();

// POST - A user can create a note using his email address and a secret.
router.post('/create', (req, res) => {
    const note = new Note({
        email: req.body.email,
        secret: req.body.secret,
        title: req.body.title,
        description: req.body.description,
        noteId: crypto.randomBytes(16).toString("hex"),
    })

    // Save Note in the database
    note.save()
        .then(data => {
            res.send(data);
        })
})

// GET lists all the notes for all users.
router.get('/findall', (req, res) => {
    Note.find()
        .then(notes => {
            res.send(notes);
        })
});

// GET lists all the notes for a particular user(email).
router.get('/find', (req, res) => {
    const email = req.query.email;
    const secret = req.headers.secret;
    Note.findOne({ email: email }).then((note) => {
        if (note) {
            if (note.secret === secret && note.email === email) {
                res.send(note);
            } else {
                res.status(401).json({
                    error: "Unauthorized"
                })
            }
        } else {
            res.status(404).json({
                error: `no notes found for ${email}`
            })
        }
    })
})

// GET the details of a particular note using note ID.
router.get('/find/:noteId', (req, res) => {
    const email = req.query.email;
    const secret = req.headers.secret;
    const noteId = req.params.noteId;
    Note.findOne({ email: email }).then((note) => {
        if (note) {
            if (note.secret === secret && note.email === email) {
                res.send(note);
            } else {
                res.status(401).json({
                    error: "Unauthorized"
                })
            }
        } else {
            res.status(404).json({
                error: `no notes found for ${email}`
            })
        }
    })
})

// PUT - user should be able to update the note using note ID email and secret.
router.put('/update/:noteId', (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    
    const email = req.query.email;
    const secret = req.headers.secret;
    const noteId = req.params.noteId;
    const title = req.body.title;
    const description = req.body.description

    Note.findOneAndUpdate({ email: email }, { title: title, description: description }, { returnOriginal: false }).then((result) => {
        if (result) {
            if (result.secret === secret) {
                res.status(200).json({
                    message: "Note updated successfully!",
                    noteId: result.noteId,
                    title: result.title,
                    description: result.description,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt
                })
            } else {
                res.status(401).json({
                    error: "Unauthorized"
                })
            }
        }
        else {
            res.status(404).json({
                error: `No notes Found on ${noteId}`
            })
        }
    })
})

// DELETE a Note with noteId
router.delete('/remove/:noteId', (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const email = req.query.email;
    const secret = req.headers.secret;
    const noteId = req.params.noteId;

    Note.findOneAndDelete({ email: email }).then((result) => {
        if (result) {
            if (result.secret === secret) {
                res.status(200).json({
                    message: "Note deleted successfully!",
                    noteId: result.noteId,
                    title: result.title,
                    description: result.description,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt
                })
            } else {
                res.status(401).json({
                    error: "Unauthorized"
                })
            }
        }
        else {
            res.status(404).json({
                error: `No notes Found on ${noteId}`
            })
        }
    })
})

module.exports = router;