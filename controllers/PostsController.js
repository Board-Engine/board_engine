var ObjectId = require('mongoose').Types.ObjectId;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Helpers = require('./Helpers');

exports.index = async (request, response) => {

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

    const errors = [];
    const validator = {
        author: ['required', 'max:30'],
        content: ['required', 'min:2', 'max:5'],
    };

    for (input in validator) {
        const request_input = request.body[input];
        const conditions = validator[input];
        
        for (condition of conditions) {

            if (condition === 'required') {
                if (! request_input.length) {
                    errors.push(`The field ${input} is required`);
                }
            }

            else if (condition.startsWith('min:')) {
                const min = condition.split(':')[1];
                if (request_input.length < min) {
                    errors.push(`The field ${input} is too short`)
                }
            }

            else if (condition.startsWith('max:')) {
                const max = condition.split(':')[1]
                if (request_input.length > max) {
                    errors.push(`The field ${input} is too long`)
                }
            }
        }
    }

    if (errors.length) {
        return response.json(errors)
    }

    // TODO VALIDATION
    const thread_id = await request.params.thread_id;
    const board_slug = await request.body.board_slug;
    const content = await request.body.content;
    const author = await request.body.author;

    const data = await {
        thread_id: ObjectId(thread_id),
        content,
        author,
    };

    await Post.create(data);

    if (board_slug) {
        return await response.redirect(`/boards/${board_slug}/${thread_id}`);
    }
    else {
        return await response.redirect(`/threads/${thread_id}`);
    }
};