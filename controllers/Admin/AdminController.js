const Board = require('../../models/Board');
const Thread = require('../../models/Thread');
const Post = require('../../models/Post');

exports.index = async (request, response, next) => {
    const tab = 'home';
    const boards = await Board.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 20
    });
    const threads = await Thread.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 20
    });
    const posts = await Post.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 20
    });


    response.render('admin/index.html', {
        tab,
        boards,
        threads,
        posts
    })
};