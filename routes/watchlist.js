const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchlistController');
const auth = require('../middlewares/auth');

router.post('/', auth.check, watchController.add);
router.delete('/:movie', auth.check, watchController.delete);
router.get('/', auth.check, watchController.list);

module.exports = router;