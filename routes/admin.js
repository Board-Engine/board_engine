const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin/AdminController');
const BoardsController = require('../controllers/Admin/BoardsController');

router.get('/', AdminController.index);

router.get('/boards', BoardsController.index);

module.exports = router;