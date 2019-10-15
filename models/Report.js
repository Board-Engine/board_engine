const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
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

const Report = mongoose.model('Report', schema);

module.exports = Report;