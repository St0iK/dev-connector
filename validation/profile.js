const { check } = require('express-validator');

const validateProfile = [
  check('handle', 'Please enter a handle between 2 & 10 characters').isLength({
    min: 2,
    max: 10
  }),
  check('email', 'Please include a valid email').isEmail(),
  check('status', 'Please include a  status').not().isEmpty(),
  check('skills', 'Please include skills').not().isEmpty(),
  check('website', 'Please include website').isURL(),
  check('youtube', 'Please include youtube').isURL(),
  check('twitter', 'Please include twitter').isURL(),
  check('facebook', 'Please include facebook').isURL(),
  check('linkedin', 'Please include linkedin').isURL(),
  check('instagram', 'Please include instagram').isURL(),
];


module.exports = {
  validateProfile
}