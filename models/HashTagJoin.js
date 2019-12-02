const config = require('../env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: 'localhost',
    dialect: 'postgres'
});
const sequelizePaginate = require('sequelize-paginate');

const HashTagJoin = sequelize.define('hash_tags_join', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    hash_tag_id: {
        type: Sequelize.INTEGER,
        references: 'hash_tags',
        referencesKey: 'id',
    },
    board_id: {
        type: Sequelize.INTEGER,
        references: 'boards',
        referencesKey: 'id',
    },
    thread_id: {
        type: Sequelize.INTEGER,
        references: 'thread_id',
        referencesKey: 'id',
    },
    post_id: {
        type: Sequelize.INTEGER,
        references: 'posts',
        referencesKey: 'id',
    },

    createdAt: {type: Sequelize.DATE, field: 'created_at'},
    updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
}, {
    sequelize,
    modelName: 'HashTagJoin'
});
sequelizePaginate.paginate(HashTagJoin);

module.exports = HashTagJoin;


