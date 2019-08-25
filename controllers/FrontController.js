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

exports.boardCreate = (request, response) => {
    response.render('front/board_create.html')
};