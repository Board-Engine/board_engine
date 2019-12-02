const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});
const sequelizePaginate = require('sequelize-paginate');

const Board = require('./Board');
const Thread = require('./Thread');
const HashTagJoin = require('./HashTagJoin');

const HashTag = sequelize.define('hash_tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'HashTag'
});
sequelizePaginate.paginate(HashTag);
/*
HashTag.hasMany(HashTagJoin, {
    foreignKey: 'hash_tag_id',
    foreignKeyConstraint: true
});

 */

module.exports = HashTag;


