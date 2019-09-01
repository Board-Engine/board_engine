const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    board_id: String,
    board_slug: String,

    title: String,
    slug: String,
    content: String,
    folder: String,
    avatar: String
});

const Thread = mongoose.model('Thread', schema);

module.exports = Thread;