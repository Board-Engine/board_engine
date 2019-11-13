const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});

const Thread = require('./Thread')

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

Board.hasMany(Thread, {
    foreignKey: 'board_id',
    foreignKeyConstraint: true
});

module.exports = Board;