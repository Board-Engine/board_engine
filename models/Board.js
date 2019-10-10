const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    slug: String,
    description: String,
    folder: String,
    image_path: String,
    ip: String,

    created_at: {
    	type: Date,
    	default: Date.now
    },
    updated_at: {
    	type: Date,
    	default: Date.now
    },
});

const Board = mongoose.model('Board', schema);

module.exports = Board;