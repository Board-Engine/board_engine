const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});
const Board = sequelize.define('board', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
    },
    folder: {
        type: Sequelize.STRING,
    },
    image_path: {
        type: Sequelize.STRING,
    },
    ip: {
        type: Sequelize.STRING,
    },

    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'Board'
});

module.exports = Board;
/*
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    slug: String,
    description: String,
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

schema.plugin(mongoosePaginate);

const Board = mongoose.model('Board', schema);

module.exports = Board;

 */