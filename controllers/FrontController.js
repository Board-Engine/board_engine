const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');

exports.index = async (request, response) => {
    const boards = await Board.find().limit(10);
    const threads = await Thread.find().limit(10);

    return await response.render('front/index.html', {
		boards,
		threads
	});
};

exports.image = async (request, response) => {

	const type = await request.params.type;
	const folder = await request.params.folder;
	const image = await request.params.image;

	const path = await `storage/app/${type}/${folder}/${image}`;

	fs.access(path, fs.constants.F_OK, async (error) => {
		if (error) {
			response.send('not exists')
		}
		else {
			const content = await fsPromises.readFile(path);
			response.writeHead(200,{'Content-type':'image/jpg'});
			response.end(content);
		}
	});
};