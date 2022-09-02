const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

//Admin
router.post('/', [auth.check, admin.check], moviesController.create);
router.put('/:id', [auth.check, admin.check], moviesController.update);
router.delete('/:id', [auth.check, admin.check], moviesController.delete);

//User
router.get('/', auth.check, moviesController.list);
router.get('/:id', auth.check, moviesController.find);

router.post('/:id/reviews', auth.check, moviesController.addReview);
router.get('/:id/reviews', moviesController.review);

module.exports = router;