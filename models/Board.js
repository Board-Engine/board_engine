const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: 'string',
});
const Board = mongoose.model('Board', schema);

module.exports = Board;