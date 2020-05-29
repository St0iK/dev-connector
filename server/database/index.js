const mongoose = require('mongoose');

module.exports = ({ logger, config }) => {

  // Exit application on error
  mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`)
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // print mongoose logs in dev env
  mongoose.set('debug', true);

  mongoose.connect(config.db, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // console.log(`Mongoose default connection is open to ${uri}`);
  return new Promise((resolve, reject) => {
    mongoose.connection.on('connected', () => {
      logger.info(`Mongoose default connection is open to ${config.db}`);
      console.log(`Mongoose default connection is open to ${config.db}`);
      resolve(mongoose.connection)
    });
  });

};