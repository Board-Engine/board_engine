const faker = require('faker');
const Board = require('../models/Board');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const User = require('../models/User');
const argon2 = require('argon2');
const crypto = require('crypto');
const config = require('../env');
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/${config.db.name}`, {useNewUrlParser: true});

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
            description: faker.lorem.words(20),
            image: crypto.randomBytes(12).toString('hex'),
            image_path: 'storage/app/boards/test'
        };

        Board.create(data)
    }
}


async function CollectionThreadsSeeder () {
    const boards = await Board.find();
    for (board of boards) {

        for (let i = 0; i < 30; i++) {
            const id = board['_id'];
            const title = faker.lorem.words(9)

            const data = {
                board_id: id,
                title,
                slug: faker.helpers.slugify(title),
                content: faker.lorem.words(20),
                folder: '11111'
            };

            Thread.create(data)
        }
    }
}

async function CollectionPostsSeeder () {
    const threads = await Thread.find();
    for (thread of threads) {
        for (let i = 0; i < 30; i++) {
            const thread_id = thread['_id'];

            const data = {
                thread_id,
                content: faker.lorem.words(50),
                author: 'Anonymouse'
            };

            Post.create(data);
        }
    }
}



async function main() {
    // await CollectionBoardsSeeder();
   // await CollectionThreadsSeeder();
    //await CollectionPostsSeeder();
    await CollectionUsersSeeder();
}
main();
