const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema({
    title: String,
    slug: String,
    content: String,
    folder: String,
    avatar: String,
    board_id: {
    	type: Schema.Types.ObjectId,
    	ref: 'boards',
    	required: [
    		true,
    		'No board id found'
    	]
    },
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

const Thread = mongoose.model('Thread', schema);

module.exports = Thread;