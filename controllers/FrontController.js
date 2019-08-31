const express = require('express');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/board', { useNewUrlParser: true });
const Board = require('../models/Board')

exports.index = async (request, response) => {
    const boards = await Board.find().exec();
    return await response.render('front/index.html', {
         boards
     });
};

exports.getBoardCreate = (request, response) => {
    response.render('front/board_create.html')
};

exports.postBoardCreate = async (request, response) => {

    const validations = [
        request.body.title.length,
        request.body.title.length > 3,
        request.body.title.length < 30,


    ];

    if (! validations.every((element) => element )) {
        console.log('no');
        return response.redirect('/');
    }

    const data = await {
        title: request.body.title,
        slug: request.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-'),
        description: request.body.description
    };

    await Board.create(data)

    return await response.redirect('/');
};