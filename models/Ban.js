const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expireAfterSeconds = 60 * 60 * 24 * 120;

let schema = new Schema({
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
schema.index({createdAt: 1}, { expireAfterSeconds });

const Ban = mongoose.model('Ban', schema);

module.exports = Ban;