const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    name: String,
    password: String,

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});
schema.methods.verifyPassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

const User = mongoose.model('User', schema);

module.exports = User;