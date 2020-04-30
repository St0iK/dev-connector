const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
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

  return res.json({msg: 'Success!'});

});

module.exports = router;