const Board = require('../../models/Board');
const Thread = require('../../models/Thread');
const Post = require('../../models/Post');

exports.index = async (request, response, next) => {
    const tab = 'home';

    const boards = await Board.find().sort({'_id': -1}).limit(20);
    const threads = await Thread.find().sort({'_id': -1}).limit(20);
    const posts = await Post.find().sort({'_id': -1}).limit(20);

    response.render('admin/index.html', {
        tab,
        boards,
        threads,
        posts
    })
};