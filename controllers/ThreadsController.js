const crypto = require('crypto');
const mongoose = require('mongoose');
const Thread = require('../models/Thread');
const Board = require('../models/Board');
const Post = require('../models/Post');
const ObjectId = mongoose.Types.ObjectId;

exports.index = async (request, response) => {

    if (request.params.board_slug) {
        // get threads by board slug
        const board_slug = request.params.board_slug;

        let board = await Board.findOne({ slug: board_slug });

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
            board
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
    const board_id = mongoose.Types.ObjectId(id);;
    const title = request.body.title;
    const slug = request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const content = request.body.content;
    const folder = crypto.randomBytes(20).toString('hex');
    const avatar = '';

    const data = await {
        board_id,
        title,
        slug,
        content,
        folder,
        avatar,
    };


    const thread = await Thread.create(data);

    const slugRedirect = request.body.slug;

    return await response.redirect(`/boards/${slugRedirect}`);
};