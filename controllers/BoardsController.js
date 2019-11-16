const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Helpers = require('./Helpers');
const redis = require('redis');
const client = redis.createClient();
const config = require('../env');
const sequelize = require('sequelize');

exports.index = async (request, response) => {

    const head_title = 'Boards';

    const limit = 100;
    let offset = 0;
    if (request.query.page) {
        const page = request.query.page;
        offset = page * limit;
    }
    const boards = await Board.findAll({
        order: [
            ['id', 'desc']
        ],
        limit,
        offset
    });
    const total = await Board.count();

    let paginates = await total / limit;
    paginates = await Math.floor(paginates);

    return await response.render('front/boards/index.html', {
        boards,
        head_title,
        paginates
    });
};

exports.create = (request, response) => {
    const head_title = 'Create board';
    return response.render('front/boards/create.html', {
        head_title
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

    const ip = crypto.createHmac('sha256', (request.headers['x-forwarded-for'] || request.connection.remoteAddress)).update(config.app.crypto.update).digest('hex');

    const folder = await crypto.randomBytes(12).toString('hex');

    const image = await request.files.image;
    const name = await image.name;

    const image_path = await `boards/${folder}/${name}`;

    const title = await request.body.title;
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const description = await request.body.description;
    
    const data = {
        title,
        slug,
        description,
        folder,
        image_path,
        ip
    };

    await fsPromises.mkdir(`storage/app/boards/${folder}`, {recursive: true});

    await image.mv(`storage/app/boards/${folder}/${name}`);
    const board = await Board.create(data);
    await client.incr('boards');

    return await response.redirect(`/boards/${board.slug}?board_id=${board.id}`);
};

exports.show = async (request, response) => {
    //const slug = request.params.slug;
    /*
    const board = await Board.findOne({
        where: {
            slug
        }
    });
    const head_title = board.title;
     */

    /*
    return response.render('front/boards/show.html', {
        board,
        head_title
    });

     */
};