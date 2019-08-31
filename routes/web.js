const express = require('express');
const router = express.Router();
const FrontController = require('../controllers/FrontController');

router.get('/', FrontController.index);

router.get('/board-create', FrontController.getBoardCreate);
router.post('/board-create', FrontController.postBoardCreate);

module.exports = router;