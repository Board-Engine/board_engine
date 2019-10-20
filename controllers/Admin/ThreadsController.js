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
    const tab = await 'threads';
    const id = await request.params.id;

    const thread = await Thread.findById(id);

    return await response.render('admin/threads/edit.html', {
        tab,
        thread
    });
};

exports.update = async (request, response) => {
    const tab = await 'threads';
    const id = await request.params.id;

    const data = {
        title: request.body.title,
        content: request.body.content,
    };

    const thread = await Thread.updateOne({'_id': id}, { $set: data });

    return await response.redirect(`/admin/threads/${id}`);
};

exports.destroy = async (request, response) => {
    const id = await request.params.id;

    const thread = await Thread.findById(id);
    const dir = await `storage/app/boards/${thread.folder}`;

    await fsPromises.rmdir(dir, { recursive: true });

    await thread.remove();

    await Post.deleteMany({ thread_id: ObjectId(id) });

    return await response.redirect('/admin/threads');
};