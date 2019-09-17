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

exports.test = async (request, response) => {
	/*
	let date = 'Mon Sep 16 2019 17:01:05 GMT+0200 (Central European Summer Time)';
	date = new Date(date);

	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDay();

	const format = `${day}/${month}/${year}`;

	response.send(format)
	*/
};