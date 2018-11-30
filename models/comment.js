const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    codigo: String,
    author: {type: String, required: [true, "author field cannot be empty"]},
    comment: {type: String, required: [true, "comment field cannot be empty"]},
});

module.exports = mongoose.model('Comment', commentSchema);