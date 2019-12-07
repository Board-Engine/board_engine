const crypto = require('crypto');

const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const HashTag = require('../models/HashTag');
const HashTagJoin = require('../models/HashTagJoin');
const Helpers = require('./Helpers');
const redis = require('redis');
const client = redis.createClient();
const fs = require('fs');
const fsPromises = fs.promises;

exports.index = async (request, response) => {

    const thread_id = await request.params.thread_id;
    const board_slug = await request.params.board_slug
    console.log('-------------- postsController')
    console.log(request.session)
    console.log('-------------- /postsController')


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
    });
};

exports.create = async (request, response) => {

};

exports.store = async (request, response) => {

    const validations = {
        [request.body.author]: ['required', 'min:2', 'max:50'],
        [request.body.content]: ['required', 'min:2', 'max:300'],
    };

    if (! Helpers.Validation.validate(validations)) {
        return response.json('validation fails')
    }
    const thread_id = await request.params.thread_id;
    const board_slug = await request.body.board_slug;
    const content = await request.body.content;
    const author = await request.body.author;
    const thread = await Thread.findOne({
        where: {
            id: thread_id
        }
    });
    const board_id = thread.board_id;

    const data = {
        thread_id,
        content,
        author,
        board_id
    };

    if (request.files != null) {
        const limit = 1000 * 1000;

        if (request.files.image.size > limit) {
            return response.status(400).send('File too large. Not more 1 Mo');
        }
        const ip = await request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const hash = await crypto.createHash('sha256').update(ip).digest('hex');
        data.ip = hash;
        const image = await request.files.image;
        const folder = await request.body.thread_folder;
        const name = await image.name;
        data.image = name;
        await image.mv(`storage/app/boards/${folder}/${name}`);
        const image_path = `/images/boards/${thread.folder}`;
        data.image_path = image_path;
    }

    const post = await Post.create(data);
    console.log(post)

    // hash tags
    function getHashTags(inputText) {
        let regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
        let matches = [];
        let match;

        while ((match = regex.exec(inputText))) {
            matches.push(match[1]);
        }

        return matches;
    }

    let hash_tags_array = [];
    let hash_tags_input = getHashTags(data.content);
    for (hash_tag of hash_tags_input) {
        if (! hash_tags_array.includes(hash_tag)) {
            hash_tags_array.push(`#${hash_tag}`);
        }
    }

    for (hash_tag of hash_tags_array) {
        const data = {
            name: hash_tag
        };

        let hash_tag_id;
        const hash_tag_already_exists = await HashTag.findOne({
            where: {
                name: hash_tag
            }
        });

        if (hash_tag_already_exists) {
            hash_tag_already_exists.update({
                updated_at: Date()
            });
            hash_tag_id = hash_tag_already_exists.id;
        }
        else {
            const hashtagDB = await HashTag.create(data)
            hash_tag_id = hashtagDB.id;
        }

        const data_hashtag = {
            hash_tag_id,
            board_id,
            thread_id: parseInt(thread_id),
            post_id: post.id
        };
    }

    client.incr('posts');

    if (board_slug) {
        return await response.redirect(`/boards/${board_slug}/${thread_id}`);
    }
    else {
        return await response.redirect(`/threads/${thread_id}`);
    }
};