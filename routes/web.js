const express = require('express');
const router = express.Router();
const FrontController = require('../controllers/FrontController');
const BoardsController = require('../controllers/BoardsController');
const ThreadsController = require('../controllers/ThreadsController');
const PostsController = require('../controllers/PostsController');
const LoginController = require('../controllers/Auth/LoginController');
const fileUpload = require('express-fileupload');

router.use(fileUpload({
	limits: {
		// in MB
		fileSize: 2 * 1024 * 1024
	}
}));

router.get('/', FrontController.index);
router.get('/images/:type/:folder/:image', FrontController.image);

router.get('/boards', BoardsController.index);
router.get('/boards/create', BoardsController.create);
router.post('/boards', BoardsController.store);

router.get('/boards/:board_slug', ThreadsController.index);
router.get('/boards/:board_slug/:board_id/create', ThreadsController.create);
router.post('/boards/:board_slug/:board_id/create', ThreadsController.store);

router.get('/boards/:board_slug/:thread_id', PostsController.index);
router.post('/posts/:thread_id', PostsController.store);

router.get('/threads', ThreadsController.index);
router.get('/threads/:thread_id', PostsController.index);

router.get('/search', FrontController.getSearch);

router.get('/contact', FrontController.getContact);

router.get('/rules', FrontController.rules);

router.get('/ads', FrontController.ads);

router.get('/support', FrontController.support);

router.get('/captcha', FrontController.captcha);
router.post('/captcha/confirm', FrontController.postCaptchaConfirm);

router.get('/login', LoginController.getLogin);
router.post('/login', LoginController.postLogin);

router.get('/test', FrontController.test);

module.exports = router;