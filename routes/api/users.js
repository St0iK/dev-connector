const express = require('express');
const router = express.Router();
const passport = require('passport');
const userHandler = require('./handlers/user');

router.get('/test', userHandler.test);
router.post('/register', userHandler.registerUser);
router.post('/login', userHandler.loginUser);
router.get('/current', passport.authenticate('jwt', { session: false }), userHandler.currentUser);

module.exports = router;
