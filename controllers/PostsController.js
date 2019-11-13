const crypto = require('crypto');

const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Helpers = require('./Helpers');
const redis = require('redis');
const client = redis.createClient();
const CounterMiddleware = require('../middleware/Counter');
const fs = require('fs');
const fsPromises = fs.promises;

exports.index = async (request, response) => {
    CounterMiddleware.handle();
    const thread_id = await request.params.thread_id;
    const board_slug = await request.params.board_slug;


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
    })
};

exports.create = async (request, response) => {

};

exports.store = async (request, response) => {

    const validations = {
        [request.body.author]: ['required', 'min:2', 'max:50'],
        [request.body.content]: ['required', 'min:2', 'max:300'],
    };

    if (! Helpers.Validation.validate(validations)) {
        console.log('no')
    }

    else {
        const thread_id = await request.params.thread_id;
        const board_slug = await request.body.board_slug;
        const content = await request.body.content;
        const author = await request.body.author;
        let board_id = await Thread.findById(thread_id);
        board_id = board_id.board_id;

        const data = {
            thread_id: ObjectId(thread_id),
            content,
            author,
            board_id
        };

        if (request.files.image) {

            const limit = 1000 * 1000;

            if (request.files.image.size > limit) {
                return response.status(400).send('File too large. Not more 1 Mo');
            }

            const ip = await request.headers['x-forwarded-for'] || request.connection.remoteAddress;
            const hash = await crypto.createHash('sha256').update(ip).digest('hex');
            data.ip = ip;

            const image = await request.files.image;

            const folder = await request.body.thread_folder;

            const name = await image.name;
            await response.json(name)

            /*
            await image.mv(`storage/app/boards/${folder}/${name}`);


            const image_path = `/images/${thread.folder}.`;

            data.image = image_path;

             */
        }
        /*
        await Post.create(data);
        client.incr('posts');

        if (board_slug) {
            return await response.redirect(`/boards/${board_slug}/${thread_id}`);
        }
        else {
            return await response.redirect(`/threads/${thread_id}`);
        }

         */
    }



};