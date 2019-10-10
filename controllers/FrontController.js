const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const config = require('../env');
const md = require('markdown-it')();
const svgCaptcha = require('svg-captcha');

const {promisify} = require('util');
const redis = require('redis');
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const keysAsync = promisify(client.keys).bind(client);


const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const CounterMiddleware = require('../middleware/Counter');


exports.index = async (request, response) => {
	
	CounterMiddleware.handle()
    const boards = await Board.find().sort({'_id': 'desc'}).limit(10);
    const threads = await Thread.find().sort({'_id': 'desc'}).limit(10);
    const head_title = 'Site';
    const counter = await getAsync('counter');
    const boards_total = await getAsync('boards');
    const threads_total = await getAsync('threads');
    const posts_total = await getAsync('posts');

    return await response.render('front/index.html', {
		boards,
		threads,
		head_title,
		counter,
		boards_total,
		threads_total,
		posts_total,
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
			const extension = path.split('.').pop();

			const content = await fsPromises.readFile(path);
			if (extension === 'svg') {
				response.setHeader('content-type', 'image/svg+xml')	
			}
			
			response.end(content);
		}
	});
};

exports.getContact = async (request, response) => {
	CounterMiddleware.handle()
	const head_title = 'contact';
	const qtox = config.contact.qtox;
	return response.render('front/contact.html', {
		head_title,
		qtox
	});
};

exports.rules = async (request, response) => {
	CounterMiddleware.handle()
	const head_title = 'Rules';
	fs.readFile('storage/rules.md', 'utf8', (error, content) => {
		if (error) {
			console.log(error)
			console.log('You have to create a file rules.md in storage folder');
			response.status(404)
		}
		const result = md.render(content);

		return response.render('front/rules.html', {
			head_title,
			result
		})
	});
};

exports.support = async (request, response) => {
	const head_title = 'Search';
	const support = config.support;

	response.render('front/support.html', {
		head_title,
		support
	});
};

exports.ads = (request, response) => {
	const head_title = 'Ads';

	response.render('front/ads.html', {
		head_title
	})
};

exports.captcha = async (request, response) => {
	const captcha = svgCaptcha.create({
		color: true,
		background: '#a8a8a8',
		size: 7,
		width: 300,
		height: 100,
	});

	const captcha_text = captcha.text;

	request.session.captcha = captcha.text;
	request.session.save(() => {
		console.log('saved')
	})
	console.log(request.session)

	response.type('svg');
	response.status(200).send(captcha.data);
};

exports.postCaptchaConfirm = async (request, response) => {
	const sess = await keysAsync('sess:*')
	if (! sess.length) {
		console.log('sess empty')
		return response.status(202).send(false)
	}

	const captcha_input = await request.body.captcha;

	for (s of sess) {
		let cookie = await getAsync(s);
		cookie = await JSON.parse(cookie);
		const captcha = await cookie.captcha;

		if (captcha_input === captcha) {
			console.log('captcha is ok')
			return response.status(202).send(true);
		}
	}

	return response.status(202).send(false);
};

exports.getSearch = async (request, response) => {
	CounterMiddleware.handle()
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