const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const argon2 = require('argon2');

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

schema.methods.generatePassword = async (password) => {
    this.password = await argon2.hash(password);
};

schema.methods.verifyPassword = async (password) => {
    return await argon2.verify(this.password, password);
};

const User = mongoose.model('User', schema);

module.exports = User;