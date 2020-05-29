const User = require("../../../models/User");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./../../../../config/keys')
const { validationResult } = require('express-validator');
const errorFormatter = require('../../../utils/error-formatter');

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorFormatter(errors));
    }

    const user = await User.findOne({ email: req.body.email }).exec();

    if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
    });

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // save new user, and return it
            const user = await newUser.save().catch(err => console.log(err));
            res.json(user);
        });
    });
}

/**
 * Login User
 */
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorFormatter(errors));
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    const user = await User.findOne({ email }).exec();

    // Check for user
    if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
    }

    // User Matched
    const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

    // Sign Token
    jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
            success: true,
            token: 'Bearer ' + token
        });
    });
}

/**
 * User will get populated from Passport
 */
const currentUser = (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
}

module.exports = {
    registerUser,
    loginUser,
    currentUser,
}
