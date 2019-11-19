const faker = require('faker');
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const User = require('../models/User');
const argon2 = require('argon2');
const crypto = require('crypto');

async function CollectionUsersSeeder() {

    let user = await new User({
        name: 'admin',
        password: await argon2.hash('password')
    });
    await user.save();

    console.log('user created');
}

async function CollectionBoardsSeeder () {
    for (let i = 0; i < 300; i++) {
        const title = faker.lorem.words(9)

        const data = {
            title,
            slug: faker.helpers.slugify(title),
            description: faker.lorem.words(9),
            folder: crypto.randomBytes(12).toString('hex'),
            image_path: 'storage/app/boards/test',
            ip: '127.0.0.1'
        };

        Board.create(data)
    }
}


async function CollectionThreadsSeeder () {
    const boards = await Board.findAll();
    for (board of boards) {

        for (let i = 0; i < 30; i++) {
            const id = board.id;
            const title = faker.lorem.words(9)

            const data = {
                board_id: id,
                title,
                slug: faker.helpers.slugify(title),
                content: faker.lorem.words(9),
                folder: '11111'
            };

            Thread.create(data)
        }
    }
}

async function CollectionPostsSeeder () {
    const threads = await Thread.findAll();
    for (thread of threads) {
        for (let i = 0; i < 30; i++) {
            const thread_id = thread.id;
            const board_id = thread.board_id;

            const data = {
                board_id,
                thread_id,
                content: faker.lorem.words(9),
                author: 'Anonymous',
                ip: '127.0.0.1'
            };

            await Post.create(data)
        }
    }
}



async function main() {
     //await CollectionBoardsSeeder();
    //await CollectionThreadsSeeder();
    //await CollectionPostsSeeder();
    //await CollectionUsersSeeder();
}
main();
