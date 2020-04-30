const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require("../../config/keys");
const passport = require('passport');
const User = require('../../models/User');

const router = express.Router();


router.get('/test', (req, res) => {
  res.json({message: 'It works'})
});

/**
 * User Registration
 */
router.post('/register', async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  console.log(user);
  if (user) {
    return res.status(400).json({email: 'Email already exists'})
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    avatar: gravatar.url(req.body.avatar, { s: '200', r: 'pg', d: 'mm'}),
    password: req.body.password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        res.json(user);
      }).catch((err) => {
        console.log(err);
      });
    })
  });

});

/**
 * User Login
 */
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return res.status(400).json({email: 'User does not exist'});
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    return res.status(400).json({email: 'Authentication Error, Please check your password'});
  }

  // Our payload, this can be decoded and used later on
  const payload = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  // Sign Token
  const jwtToken = await jwt.sign(payload, secretOrKey, {expiresIn: 3600});

  return res.json({
      msg: 'Success!',
      token: 'Bearer ' + jwtToken,
  });

});


/**
 * Return the current user
 */
router.get('/current', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      name: req.user.name,
      email: req.user.email,
    })
  }
);

module.exports = router;