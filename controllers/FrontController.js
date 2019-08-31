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
    //TODO VALIDATE DATA
    const data = await {
        title: request.body.title,
    };

    await Board.create(data)

    return await response.redirect('/');
};