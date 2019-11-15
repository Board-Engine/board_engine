const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const mongoose = require('mongoose');
const Thread = require('../models/Thread');
const Board = require('../models/Board');
const Helpers = require('./Helpers');
const Post = require('../models/Post');
const ObjectId = mongoose.Types.ObjectId;
const redis = require('redis');
const client = redis.createClient();
const CounterMiddleware = require('../middleware/Counter');

exports.index = async (request, response) => {
    CounterMiddleware.handle();

    let view = '';
    let head_title = '';

    // paginate ---------------
    const total = 100;

    const limit = 100;
    let offset = 0;
    let paginates = await total / limit;
    paginates = await Math.floor(paginates);

    if (request.query.page) {
        const page = request.query.page;
        offset = page * limit;
    }
    // end paginate -------------

    let data = {
        head_title,
        paginates
    };

    if (request.params.board_slug) {
        const slug = request.params.board_slug
        const id = await request.query.board_id;
        const board = await Board.findOne({
            where:{
                slug,
            },
            include:[
                {
                    model:Thread,
                    as:'threads',
                    required:false,
                    offset,
                    limit
                }
            ],
        });

        data.head_title = board.title;
        view = 'front/threads/index.html';
        data.board = board;
    }
    else {
        // get all threads
        data.head_title = 'Threads';
        view = 'front/threads/table.html';

        const threads = await Thread.findAll({
            offset,
            limit
        });

        data.threads = threads
    }
    return await response.render(view, data)
};

exports.create = async (request, response) => {
    const board_id = await request.params.board_id;

    const board = await Board.findOne({ where: {
            id: board_id
        }
    });

    return await response.render('front/threads/create.html', {
        board
    });
};

exports.store = async (request, response) => {

    const limit = 1000 * 1000;
    const validations = {
        [request.body.title]: ['required', 'min:2', 'max:50'],
        [request.body.description]: ['required', 'min:2', 'max:300'],
    };

    if (! Helpers.Validation.validate(validations)) {
        return response.json('fail')
    }
    if (request.files === null) {
        return response.status(400).send('No files were uploaded.');
    }

    if (request.files.image.size > limit) {
        return response.status(400).send('File too large. Not more 1 Mo');
    }

    const board_id = await request.params.board_id;
    const board = await Board.findOne({ where: {
            id: board_id
        }
    });
    const folder = await board.folder;

    const title = await request.body.title;
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const content = await request.body.content;

    const data = {
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
    await image.mv(`storage/app/${image_path}`);

    data.image_path = await image_path;

    const thread = await Thread.create(data);

    const slugRedirect = await board.slug;

    client.incr('threads');

    return await response.redirect(`/boards/${slugRedirect}?board_id=${board_id}`);
};