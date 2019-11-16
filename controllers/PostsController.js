const crypto = require('crypto');

const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Helpers = require('./Helpers');
const redis = require('redis');
const client = redis.createClient();
const fs = require('fs');
const fsPromises = fs.promises;

exports.index = async (request, response) => {

    const thread_id = await request.params.thread_id;
    const board_slug = await request.params.board_slug
    console.log('-------------- postsController')
    console.log(request.session)
    console.log('-------------- /postsController')


    const thread = await Thread.findOne({
        where: {
            id: thread_id
        },
        include: [
            {
                model: Post,
                as: 'posts',
                required: false,
                //offset,
                //limit
            }
        ]
    });
    const head_title = thread.title;

    return await response.render('front/posts/index.html', {
        thread,
        board_slug,
        head_title
    });
};

exports.create = async (request, response) => {

};

exports.store = async (request, response) => {

    const validations = {
        [request.body.author]: ['required', 'min:2', 'max:50'],
        [request.body.content]: ['required', 'min:2', 'max:300'],
    };

    if (! Helpers.Validation.validate(validations)) {
        return response.json('validation fails')
    }
    const thread_id = await request.params.thread_id;
    const board_slug = await request.body.board_slug;
    const content = await request.body.content;
    const author = await request.body.author;
    const thread = await Thread.findOne({
        where: {
            id: thread_id
        }
    });
    const board_id = thread.board_id;

    const data = {
        thread_id,
        content,
        author,
        board_id
    };

    /*
    if (request.files.image) {
        const limit = 1000 * 1000;

        if (request.files.image.size > limit) {
            return response.status(400).send('File too large. Not more 1 Mo');
        }
        const ip = await request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const hash = await crypto.createHash('sha256').update(ip).digest('hex');
        data.ip = hash;
        const image = await request.files.image;
        const folder = await request.body.thread_folder;
        const name = await image.name;
        await image.mv(`storage/app/boards/${folder}/${name}`);
        const image_path = `/images/${thread.folder}.`;
    }
     */

    await Post.create(data);
    client.incr('posts');

    if (board_slug) {
        return await response.redirect(`/boards/${board_slug}/${thread_id}`);
    }
    else {
        return await response.redirect(`/threads/${thread_id}`);
    }
};