const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});
const sequelizePaginate = require('sequelize-paginate')

const Board = require('./Board');
const Post = require('./Post');

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
    image: {
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

sequelizePaginate.paginate(Thread);

Thread.hasMany(Post, {
    foreignKey: 'thread_id',
    foreignKeyConstraint: true
});
/*
Thread.belongsTo(Board, {
    foreignKey: 'board_id'
});

 */

module.exports = Thread;