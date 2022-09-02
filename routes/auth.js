const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const controller = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/me', controller.check, authController.me);

module.exports = router;