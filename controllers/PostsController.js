var ObjectId = require('mongoose').Types.ObjectId;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Helpers = require('./Helpers');
const redis = require('redis');
const client = redis.createClient();
const CounterMiddleware = require('../middleware/Counter');

exports.index = async (request, response) => {
    CounterMiddleware.handle();
    const board_slug = await request.params.board_slug;
    const thread_id = await request.params.thread_id;

    let thread = await Thread.findById(thread_id);
    const head_title = thread.title;

    thread = await Thread.aggregate([
        { 
            $lookup: { 
                from: 'posts', 
                localField: '_id', 
                foreignField: 'thread_id', 
                as: 'posts'
            }, 
        },
        {
            $match: {
                '_id': ObjectId(thread.id)
            }
        },
        {
            $limit: 1
        }  
    ]);

    thread = await thread[0]
    

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

        const data = {
            thread_id: ObjectId(thread_id),
            content,
            author,
        };

        await Post.create(data);
        client.incr('posts');

        if (board_slug) {
            return await response.redirect(`/boards/${board_slug}/${thread_id}`);
        }
        else {
            return await response.redirect(`/threads/${thread_id}`);
        }
    }
};