const fs = require('fs');
const fsPromises = fs.promises;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Board = require('../../models/Board');
const Thread = require('../../models/Thread');
const Post = require('../../models/Post');

exports.index = async (request, response) => {
    const tab = 'threads';

    const limit = 50;

    let threads = await Thread.paginate({}, {limit})

    if (request.query.page) {
        const page = request.query.page;
        threads = await Thread.paginate({}, { limit, page })
    }

    if (request.query.search) {
        const word = request.query.search;
        threads = await Thread.paginate(
            {
                'title' : new RegExp(word, 'i')
            },
            {
                limit: 50
            }
        )
    }

    response.render('admin/threads/index.html', {
        tab,
        threads
    })
};

exports.edit = async (request, response) => {

};