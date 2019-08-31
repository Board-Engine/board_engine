const crypto = require('crypto');
const Board = require('../models/Board');

exports.index = async (request, response) => {
    const boards = await Board.find();

    return await response.render('front/boards/index.html', {
        boards
    })
};

exports.create = (request, response) => {
    return response.render('front/boards/create.html');
};

exports.store = async (request, response) => {
    const validations = [
        request.body.title.length,
        request.body.title.length > 3,
        request.body.title.length < 30,
    ];

    if (! validations.every((element) => element )) {
        console.log('no');
        request.flash('error', 'error')
        return response.redirect('/');
    }

    const title = request.body.title;
    const slug = request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const description = request.body.description;
    const folder = crypto.randomBytes(20).toString('hex');

    const data = await {
        title,
        slug,
        description,
        folder,
    };

    await Board.create(data)

    return await response.redirect('/boards');
};