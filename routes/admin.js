const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const BoardsController = require('../controllers/Admin/BoardsController');


router.use(methodOverride('_method'))

router.get('/', AdminController.index);

router.get('/boards', BoardsController.index);
router.get('/boards/:id', BoardsController.edit);
router.post('/boards/:id', BoardsController.update);
router.delete('/boards/:id', BoardsController.destroy);

module.exports = router;