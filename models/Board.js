const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const board_schema = new Schema({
    title: String,
    slug: String,
    description: String,
    folder: String,
    avatar: String
});

const Board = mongoose.model('Board', board_schema);

module.exports = Board;