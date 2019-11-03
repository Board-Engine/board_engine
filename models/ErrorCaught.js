const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    page: String,
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

schema.plugin(mongoosePaginate);

const ErrorCaught = mongoose.model('ErrorCaught', schema);

module.exports = ErrorCaught;