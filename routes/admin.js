const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const BoardsController = require('../controllers/Admin/BoardsController');
const ThreadsController = require('../controllers/Admin/ThreadsController');
const PostsController = require('../controllers/Admin/PostsController');

router.use(methodOverride('_method'));

const auth = require('../middleware/auth')

router.use(auth)

router.get('/', AdminController.index);

router.get('/boards', BoardsController.index);
router.get('/boards/:id', BoardsController.edit);
router.post('/boards/:id', BoardsController.update);
router.delete('/boards/:id', BoardsController.destroy);

router.get('/threads', ThreadsController.index);
router.get('/threads/:id', ThreadsController.edit);
router.post('/threads/:id', ThreadsController.update);
router.delete('/threads/:id', ThreadsController.destroy);

router.get('/posts', PostsController.index);
router.get('/posts/:id', PostsController.edit);
router.post('/posts/:id', PostsController.update);
router.delete('/posts/:id', PostsController.destroy);

module.exports = router;