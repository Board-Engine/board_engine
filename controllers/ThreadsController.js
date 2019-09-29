const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const mongoose = require('mongoose');
const Thread = require('../models/Thread');
const Board = require('../models/Board');
const Post = require('../models/Post');
const ObjectId = mongoose.Types.ObjectId;
const redis = require('redis');
const client = redis.createClient();
const CounterMiddleware = require('../middleware/Counter');

exports.index = async (request, response) => {
    CounterMiddleware.handle();
    if (request.params.board_slug) {
        // get threads by board slug
        const board_slug = request.params.board_slug;

        let board = await Board.findOne({ slug: board_slug });
        const head_title = board.title;

        board = await Board.aggregate([ 
            { 
                $lookup: { 
                    from: 'threads', 
                    localField: '_id', 
                    foreignField: 'board_id', 
                    as: 'threads' 
                }, 
            },
            {
                $match: {
                    '_id': ObjectId(board.id)
                }
            },

            {
                $limit: 1
            }    
        ]);

        board = await board[0];

        return await response.render('front/threads/index.html', {
            board,
            head_title
        });
    }
    else {
        // get all threads
        const limit = 100;
        let skip = 0;
        if (request.query.page) {
            const page = request.query.page;
            skip = page * limit;
        }
        const threads = await Thread.find().skip(skip).limit(limit);
        const total = await Thread.estimatedDocumentCount();
        let paginates = await total / limit;
        paginates = await Math.floor(paginates)

        const head_title = 'Threads';

        return await response.render('front/threads/table.html', {
            threads,
            head_title,
            paginates
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

    const validations = {
        [request.body.title]: ['required', 'min:2', 'max:50'],
        [request.body.content]: ['required', 'min:2', 'max:300'],
    };

   return  response.json(validations)

    if (Object.keys(request.files).length == 0) {
        return response.send('No files were uploaded.');
    }

    if (! Helpers.Validation.validate(validations)) {
        return response.status(400).send('Not validated');
    }
    else {
        return response.json('ok')
    }


    const id = await request.body.id;
    const board = await Board.findById(id);
    const folder = await board.folder;

    
    const board_id = await mongoose.Types.ObjectId(id);;
    const title = await request.body.title;
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const content = await request.body.content;

    const data = await {
        board_id,
        title,
        slug,
        content,
        folder,
    };

    // Image
    const image = await request.files.image;
    const name = await image.name;
    const image_path = await `boards/${folder}/${name}`;
    await image.mv(`storage/app/boards/${folder}/${name}`);

    data.image_path = image_path;

    const thread = await Thread.create(data);

    const slugRedirect = await request.body.slug;

    client.incr('threads');

    return await response.redirect(`/boards/${slugRedirect}`);
};