const { check } = require('express-validator');

const validateExperience = [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company text is required').not().isEmpty(),
  check('from', 'From text is required').not().isEmpty(),
];

module.exports = {
  validateExperience,
}