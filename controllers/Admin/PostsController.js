const fs = require('fs');
const fsPromises = fs.promises;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Board = require('../../models/Board');
const Thread = require('../../models/Thread');
const Post = require('../../models/Post');

exports.index = async (request, response) => {
    const tab = 'posts';

    const limit = 50;

    let posts = await Thread.paginate({}, {limit})

    if (request.query.page) {
        const page = request.query.page;
        posts = await Post.paginate({}, { limit, page })
    }

    if (request.query.search) {
        const word = request.query.search;
        posts = await Post.paginate(
            {
                'title' : new RegExp(word, 'i')
            },
            {
                limit: 50
            }
        )
    }

    response.render('admin/posts/index.html', {
        tab,
        posts
    })
};

exports.edit = async (request, response) => {
    const tab = await 'posts';
    const id = await request.params.id;

    const post = await Post.findById(id);

    return await response.render('admin/posts/edit.html', {
        tab,
        post
    });
};

exports.update = async (request, response) => {
    const tab = await 'posts';
    const id = await request.params.id;

    const data = {
        title: request.body.title,
        content: request.body.content,
    };

    const post = await Post.updateOne({'_id': id}, { $set: data });

    return await response.redirect(`/admin/posts/${id}`);
};

exports.destroy = async (request, response) => {
    const id = await request.params.id;

    const post = await Post.findById(id);
    const dir = await `storage/app/boards/${post.folder}`;

    await fsPromises.rmdir(dir, { recursive: true });

    await post.remove();

    return await response.redirect('/admin/posts');
};