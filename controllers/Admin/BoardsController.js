const Board = require('../../models/Board');

exports.index = async (request, response) => {
    const tab = 'boards';
    const boards = await Board.find().sort({'created_at': 'desc'});

    response.render('admin/boards/index.html', {
        tab,
        boards
    })
};

exports.show = async (request, response) => {

};