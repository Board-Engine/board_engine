const crypto = require('crypto');
const Board = require('../models/Board');
const Thread = require('../models/Thread');

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
        return response.redirect('/boards/create');
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

    const board = await Board.create(data)

    return await response.redirect(`/boards/${board.slug}`);
};

exports.show = async (request, response) => {
    const slug = request.params.slug;

    const board = await Board.findOne({ slug });

    const threads = await Thread.find({ board_id: board.id })

    return response.render('front/boards/show.html', {
        board,
        threads
    })
};