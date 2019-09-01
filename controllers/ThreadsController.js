const crypto = require('crypto');
const Thread = require('../models/Thread');
const Board = require('../models/Board');
const Post = require('../models/Post');

exports.index = async (request, response) => {

    if (request.params.board_slug) {
        // get threads by board slug
        const board_slug = request.params.board_slug;
        const board = await Board.findOne({ slug: board_slug });
        const board_id = board.id;
        const threads = await Thread.find({ board_id });

        return await response.render('front/threads/index.html', {
            board,
            threads,
        });
    }
    else {
        // get all threads
        const threads = await Thread.find();

        return await response.render('front/threads/table.html', {
            threads
        });
    }

};

exports.create = async (request, response) => {

    const slug = await request.params.board_slug;
    const board = await Board.findOne({ slug });

    return await response.render('front/threads/create.html', {
        board
    })
};

exports.store = async (request, response) => {
    const id = request.body.id;
    const board_id = id;
    const title = request.body.title;
    const slug = request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const content = request.body.content;
    const folder = crypto.randomBytes(20).toString('hex');
    const avatar = '';

    const data = {
        board_id,
        title,
        slug,
        folder,
        avatar,
    };

    const thread = await Thread.create(data);

    const post = await Post.create({
        board_id,
        thread_id: thread.id,
        content,
    });

    const slugRedirect = request.body.slug;

    return await response.redirect(`/boards/${slugRedirect}`);
};