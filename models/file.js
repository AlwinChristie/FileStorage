// import mongoose
const mongoose = require('mongoose');

// define schema for a file
var fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: 'File name is required'
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    username: {
        type: String,
        required: 'Username is required'
    },
    file: {
        type: String,
        required: 'File is required'
    }
})

// make public
module.exports = mongoose.model('File', fileSchema);