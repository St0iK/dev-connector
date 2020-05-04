const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../../config/keys");
const passport = require("passport");
const User = require("../../models/User");
const validateRegisterInput = require("../../validation/register");
const router = express.Router();

/**
 * User Registration
 */
router.post("/register", async (req, res) => {
  // validate input
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // find user by email
  const user = await User.findOne({ email: req.body.email }).exec();

  // Use is found, return 400, user already exists
  if (user) {
    return res.status(400).json({
      email: "Email already exists",
    });
  }

  // Create a new user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    avatar: gravatar.url(req.body.avatar, { s: "200", r: "pg", d: "mm" }),
    password: req.body.password,
  });

  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;

      // Save new user
      newUser
        .save()
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

/**
 * User Login
 */
router.post("/login", async (req, res) => {
  // validate input
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return res.status(400).json({
      email: "User does not exist",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      email: "Authentication Error, Please check your password",
    });
  }

  // Our payload, this can be decoded and used later on
  const payload = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  // Sign Token
  const jwtToken = await jwt.sign(payload, secretOrKey, { expiresIn: 3600 });

  return res.json({ msg: "Success!", token: "Bearer " + jwtToken });
});

/**
 * Return the current user
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
