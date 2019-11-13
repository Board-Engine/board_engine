const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});
const Thread = sequelize.define('thread', {
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
    content: {
        type: Sequelize.STRING,
    },
    folder: {
        type: Sequelize.STRING,
    },
    avatar: {
        type: Sequelize.STRING,
    },
    image_path: {
        type: Sequelize.STRING,
    },
    board_id: {
        type: Sequelize.INTEGER,
        references: 'boards',
        referencesKey: 'id',
    },
    ip: {
        type: Sequelize.STRING,
    },

    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'Thread'
});

module.exports = Thread;
/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema({
    title: String,
    slug: String,
    content: String,
    folder: String,
    avatar: String,
    board_id: {
    	type: Schema.Types.ObjectId,
    	ref: 'boards',
    	required: [
    		true,
    		'No board id found'
    	]
    },
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

const Thread = mongoose.model('Thread', schema);

module.exports = Thread;

 */