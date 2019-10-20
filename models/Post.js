const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema({
    author: String,
    image: String,
    content: String,
    thread_id: {
    	type: Schema.Types.ObjectId,
    	ref: 'threads',
    	required: [
    		true,
    		'No thread id found'
    	]
    },
    board_id: {
        type: Schema.Types.ObjectID,
        ref: 'boards',
        required: [
            true,
            'No board id found'
        ]
    },
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

schema.method('sayHello', () => {
    console.log('ok')
    return 'okok'
})

const Post = mongoose.model('Post', schema);

module.exports = Post;