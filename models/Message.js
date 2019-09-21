const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    email: String,
    content: String,

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model('Message', schema);

module.exports = Message;