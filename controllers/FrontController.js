const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Message = require('../models/Message');

exports.index = async (request, response) => {
    const boards = await Board.find().limit(10);
    const threads = await Thread.find().limit(10);
    const head_title = 'Site';


    return await response.render('front/index.html', {
		boards,
		threads,
		head_title,
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

exports.getContact = async (request, response) => {
	const head_title = 'contact';
	return response.render('front/contact.html', {
		head_title
	});
};

exports.postContact = async (request, response) => {

	const name = request.body.name;
	const email = request.body.email;
	const content = request.body.content;

	const data = {
		name,
		email,
		content
	};

	await Message.create(data);

	return response.redirect('/');
};

exports.getSearch = async (request, response) => {

	const head_title = 'Search';
	const words = request.query.words;
	const section = request.query.section;

	let results = [];

	switch (section) {
		case 'boards':
			results = await Board.find(
				{
					"title": {
						"$regex": words, "$options": "i"
					}
				},
			);
			break;
		case 'threads':
			results =  await Thread.find(
				{
					"title": {
						"$regex": words, "$options": "i"
					}
				},
			);
			break;
		case 'posts':
			results =  await Post.find(
				{
					"content": {
						"$regex": words, "$options": "i"
					}
				},
			);
			break;
		default:
			results = [];
	}

	console.log(results)

	return response.render('front/search.html', {
		head_title,
		words,
		section,
		results,
	})
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