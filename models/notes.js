const mongoose = require('mongoose');

//creating model for note
const NoteSchema = mongoose.Schema({
    noteId:{type:String, required: true, },
    email:{type:String, required: true},
    secret:{type:String, required: true},
    title:{type:String, required: true},
    description:{type:String, required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);