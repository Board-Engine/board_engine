const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    slug: String,
    description: String,
    folder: String,
    avatar: String
});

const Board = mongoose.model('Board', schema);

module.exports = Board;