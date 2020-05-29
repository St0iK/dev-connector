const { check } = require('express-validator');

const validateEducation = [
  check('school', 'Title is required').not().isEmpty(),
  check('degree', 'Company text is required').not().isEmpty(),
  check('fieldofstudy', 'From text is required').not().isEmpty(),
  check('from', 'From text is required').not().isEmpty(),
];

module.exports = {
  validateEducation,
}
