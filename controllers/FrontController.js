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