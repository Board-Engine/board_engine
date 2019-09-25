const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Helpers = require('./Helpers');

exports.index = async (request, response) => {

    const limit = 100;
    let skip = 0;
    if (request.query.page) {
        const page = request.query.page;
        skip = page * limit;
    }

    const boards = await Board.find().sort({'_id': 'desc'}).skip(skip).limit(limit);
    const total = await Board.estimatedDocumentCount();
    let paginates = await total / limit;
    paginates = await Math.floor(paginates)
    const head_title = 'Boards';

    return await response.render('front/boards/index.html', {
        boards,
        head_title,
        paginates
    })
};

exports.create = (request, response) => {
    const head_title = 'Create board';
    return response.render('front/boards/create.html', {
        head_title
    });
};

exports.store = async (request, response) => {

    if (Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    }

    const folder = await crypto.randomBytes(12).toString('hex');

    const image = await request.files.image;
    const name = await image.name;

    
    const image_path = await `boards/${folder}/${name}`;
    
    const validations = [
        request.body.title.length,
        request.body.title.length > 3,
        request.body.title.length < 30,
    ];

    if (! validations.every((element) => element )) {
        console.log('no');
        request.flash('error', 'error')
        return response.redirect('/boards/create');
    }

    const title = await request.body.title;
    const slug = await request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const description = await request.body.description;
    
    const data = {
        title,
        slug,
        description,
        folder,
        image_path
    };

    await fsPromises.mkdir(`storage/app/boards/${folder}`, {recursive: true})


    await image.mv(`storage/app/boards/${folder}/${name}`);
    const board = await Board.create(data);

    return await response.redirect(`/boards/${board.slug}`);
};

exports.show = async (request, response) => {
    const slug = request.params.slug;
    const board = await Board.findOne({ slug });
    const head_title = board.title;


    return response.render('front/boards/show.html', {
        board,
        head_title
    })
};