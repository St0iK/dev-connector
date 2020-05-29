const express = require('express');

const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const users = require('../routes/api/users');
const profile = require('../routes/api/profile');
const posts = require('../routes/api/posts');
const { Router } = require('express');


module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler }) => {
  const router = Router();

  // Body parser middleware
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  // Passport middleware
  router.use(passport.initialize());

  // Passport Config
  require('../utils/passport')(passport);

  // Use Routes
  router.use('/api/users', users);
  router.use('/api/profile', profile);
  router.use('/api/posts', posts);

  // Server static assets if in production
  if (process.env.NODE_ENV === 'production') {
    // Set static folder
    router.use(express.static('client/build'));

    router.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

  // const port = process.env.PORT || 5000;

  // app.listen(port, () => console.log(`Server running on port ${port}`));
  return router;
};
