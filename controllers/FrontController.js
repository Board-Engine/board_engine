const fs = require('fs');
const fsPromises = fs.promises;
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const HashTag = require('../models/HashTag');
const HashTagJoin = require('../models/HashTagJoin');
const Report = require('../models/Report');
const config = require('../env');
const md = require('markdown-it')();
const Helpers = require('./Helpers');

const {promisify} = require('util');
const redis = require('redis');
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const keysAsync = promisify(client.keys).bind(client);

const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: 'localhost',
	dialect: 'postgres'
});

exports.index = async (request, response) => {
	const limit = 40

    let boards = await Board.findAll({
		limit,
		order: [
			['id', 'desc']
		]
    });

    boards = await Helpers.Array.chunk(boards, 2);

  //  let threads = await Thread.find().sort({'_id': 'desc'}).limit(10);
    let threads = await Thread.findAll({
		order: [
			['id', 'desc'],
		],
		limit,
	});
    threads = await Helpers.Array.chunk(threads, 2);

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
	const head_title = 'contact';
	const qtox = config.contact.qtox;
	return response.render('front/contact.html', {
		head_title,
		qtox
	});
};

exports.rules = async (request, response) => {
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

exports.error = (request, response) => {
	const head_title = 'Error';
	response.render('front/error.html', {
		head_title
	})
};



exports.postReport = async (request, response) => {
	
	const content = request.body.report;
	const url = request.body.url_report;

	const data = {
		content,
		url
	};

	await Report.create(data);

	return await response.json(true);
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

exports.getHashTag = async (request, response) => {
	const hash_tag = await request.params.hashtag;
	const head_title = `Search #${hash_tag}`

	const query = `select * from hash_tags 
					LEFT JOIN hash_tags_joins on hash_tags.id = hash_tags_joins.hash_tag_id
					LEFT JOIN boards AS BOARDS on boards.id = hash_tags_joins.board_id
					LEFT JOIN threads AS THREADS on threads.id = hash_tags_joins.thread_id
					LEFT JOIN posts AS POSTS on posts.id = hash_tags_joins.post_id
					WHERE name = '#${hash_tag}'
					`;

	let results = await sequelize.query(query, { raw: true })
	results = results[0]

	return await response.render('front/hashtags.html', {
		head_title,
		hash_tag,
		results
	})
};

exports.test = async (request, response) => {
	const sessions = await keysAsync('sess*');
	for (session of sessions) {
		let captcha = await getAsync(session)
		captcha = JSON.parse(captcha);
		captcha = captcha.captcha;
		console.log(captcha);
	}
	response.json(sessions)
};