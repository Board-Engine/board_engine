const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');

exports.index = async (request, response) => {

    const board_slug = await request.params.board_slug;
    const thread_id = await request.params.thread_id;
    const posts = await Post.find({ thread_id });

    return await response.render('front/posts/index.html', {
        board_slug,
        posts,
        thread_id,
    });
};

exports.create = async (request, response) => {

};

exports.store = async (request, response) => {

    // TODO VALIDATION
    const thread_id = await request.body.thread_id;
    const board_slug = await request.body.board_slug;
    const content = await request.body.content;

    const data = await {
        thread_id,
        content
    };

    await Post.create(data);

    return await response.redirect(`/boards/${board_slug}/${thread_id}`)
};