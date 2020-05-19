const express = require('express');
const router = express.Router();
const passport = require('passport');
const userHandler = require('./handlers/user');
const { check, validationResult } = require('express-validator/check');
const { validateRegister, validateLogin } = require('../../validation/user.js');

router.get('/test', userHandler.test);
router.post('/register', validateRegister, userHandler.registerUser);
router.post('/login', validateLogin, userHandler.loginUser);
router.get('/current', passport.authenticate('jwt', { session: false }), userHandler.currentUser);

module.exports = router;
