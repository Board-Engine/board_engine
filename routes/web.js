const express = require('express');
const router = express.Router();

const FrontController = require('../controllers/FrontController');
const BoardsController = require('../controllers/BoardsController');

router.get('/', FrontController.index);

router.get('/boards', BoardsController.index);
router.get('/boards/create', BoardsController.create);
router.post('/boards', BoardsController.store);


router.get('/board/:slug', FrontController.getBoard);

router.get('/board/:slug/create/:id', FrontController.getThreadCreate);
router.post('/board/:slug/create/:id', FrontController.postThreadCreate);

router.get('/board/:slug/:id', FrontController.getThread);

router.get('/board/:slug/:id/create-post', FrontController.getPostCreate);

module.exports = router;