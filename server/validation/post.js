const { check } = require('express-validator');

const validatePostInput = [
  check('text', 'Post text is required').not().isEmpty(),
  check('text', 'Please enter a post text between 10 and 300 charactesrs').isLength({
    min: 10, max: 300
  })
];

module.exports = {
  validatePostInput,
}