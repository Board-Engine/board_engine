const crypto = require('crypto');
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');


exports.index = async (request, response) => {
    const boards = await Board.find().limit(10);
    const threads = await Thread.find().limit(10);

    return await response.render('front/index.html', {
        boards,
        threads
     });
};





exports.getBoard = async (request, response) => {
    const slug = request.params.slug;

    const board = await Board.findOne({ slug });

    const threads = await Thread.find({ board_id: board.id })

    return response.render('front/board.html', {
        board,
        threads
    })
};

exports.getThreadCreate = async (request, response) => {
    const id = await request.params.id;
    const board = await Board.findById(id);
    await response.render('front/threads/create.html', {
        board
    })
};

exports.postThreadCreate = async (request, response) => {

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

    const slugRedirect = request.params.slug;

    return await response.redirect(`/board/${slugRedirect}`);
};

exports.getThread = async (request, response) => {
    const board_id = await request.params.id;
    const slug = await request.params.slug;
    const posts = await Post.find({ thread_id: board_id });

    return await response.render('front/threads/posts.html', {
        board_id,
        slug,
        posts
    })
};

exports.getPostCreate = async (request, response) => {
    response.render('ok');
};