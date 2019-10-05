const Board = require('../../models/Board');

exports.index = async (request, response) => {
    const tab = 'boards';
    const boards = await Board.find();

    response.render('admin/boards/index.html', {
        tab,
        boards
    })
};

exports.show = async (request, response) => {
    
};