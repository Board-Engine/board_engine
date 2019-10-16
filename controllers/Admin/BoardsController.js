const Board = require('../../models/Board');

exports.index = async (request, response) => {
    const tab = 'boards';
    let boards = await Board.find().sort({'created_at': 'desc'});

    if (request.query.search) {
    	const word = request.query.search;
    	boards = await Board.find(
    		{
    			'title' : new RegExp(word, 'i')
    		}
    	)
    }

    response.render('admin/boards/index.html', {
        tab,
        boards
    })
};

exports.edit = async (request, response) => {
	const tab = await 'boards';
	const id = await request.params.id;

	const board = await Board.findById(id);

	return await response.render('admin/boards/edit.html', {
		tab,
		board
	});
};

exports.update = async (request, response) => {
	const tab = await 'boards';
	const id = await request.params.id;

	const data = {
		title: request.body.title,
		description: request.body.description,
	}

	const board = await Board.updateOne({'_id': id}, { $set: data });

	return await response.redirect(`/admin/boards/${id}`);
};

exports.destroy = async (request, response) => {
	const id = await request.params.id;
	
	await Board.findByIdAndDelete(id)

	return await response.redirect('/admin/boards');
};