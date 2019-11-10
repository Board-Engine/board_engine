const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const schema = new Schema({
    expires: Date,
    session: String
});

const Session = mongoose.model('Session', schema);

module.exports = Session;