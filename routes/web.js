const express = require('express');
const router = express.Router();
const FrontController = require('../controllers/FrontController');
const BoardsController = require('../controllers/BoardsController');
const ThreadsController = require('../controllers/ThreadsController');
const PostsController = require('../controllers/PostsController');
const LoginController = require('../controllers/Auth/LoginController');
const fileUpload = require('express-fileupload');


//const errorsMiddleware = require('../middleware/errors');
// TODO DEBUG ERROR CATCHER
function errorsMiddleware(error, request, response, next) {
	console.log(error.stack);
	response.status(500).send({"Error" : error.stack});
}
router.use(errorsMiddleware);

const session = require('express-session');
const passport = require('passport')
require('../config/passport')(passport);
router.use(passport.initialize());
router.use(passport.session());

const BansMiddleware = require('../middleware/bans');


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
router.get('/threads/:thread_id', PostsController.index); //

router.get('/search', FrontController.getSearch);

router.get('/contact', FrontController.getContact);

router.get('/rules', FrontController.rules);

router.get('/ads', FrontController.ads);

router.get('/support', FrontController.support);

router.get('/captcha', FrontController.captcha);
router.post('/captcha/confirm', FrontController.postCaptchaConfirm);

router.post('/report', FrontController.postReport);

router.get('/login', LoginController.getLogin);

router.get('/error', FrontController.error);

router.post('/login', passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/login',
	failureFlash: true
}), (request, response) => {
	console.log(`after login: ${request.isAuthenticated()}`)
});

router.get('/logout', (request, response) => {
	request.logout();
	response.redirect('/');
});

router.get('/test', FrontController.test);

module.exports = router;