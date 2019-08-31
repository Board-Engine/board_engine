const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
    board_id: String,
    thread_id: String,
    content: String,
});

const Post = mongoose.model('Post', schema);

module.exports = Post;