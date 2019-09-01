const express = require('express');
const router = express.Router();

const FrontController = require('../controllers/FrontController');
const BoardsController = require('../controllers/BoardsController');
const ThreadsController = require('../controllers/ThreadsController');
const PostsController = require('../controllers/PostsController');

router.get('/', FrontController.index);

router.get('/boards', BoardsController.index);
router.get('/boards/create', BoardsController.create);
router.post('/boards', BoardsController.store);

router.get('/boards/:board_slug', ThreadsController.index);
router.get('/boards/:board_slug/:board_id/create', ThreadsController.create);
router.post('/boards/:board_slug/:board_id/create', ThreadsController.store);

router.get('/boards/:board_slug/:thread_id', PostsController.index);
router.post('/posts/:thread_id', PostsController.store);

router.get('/threads', ThreadsController.index);


module.exports = router;