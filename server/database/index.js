const mongoose = require('mongoose');

module.exports = ({ logger, config }) => {

  let uri = 'mongodb+srv://devconnector:123123123@cluster0-ztwjn.gcp.mongodb.net/test?retryWrites=true&w=majority';
  if (config.env === 'test') {
    // const { username, password, database, host, port, dialect } = config.db;
    // uri = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
    uri = config.db;
  }

  // Exit application on error
  mongoose.connection.on('error', (err) => {
    console.log(`MongoDB connection error: ${err}`)
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // print mongoose logs in dev env
  mongoose.set('debug', true);

  mongoose.connect(uri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // console.log(`Mongoose default connection is open to ${uri}`);
  return new Promise((resolve, reject) => {
    mongoose.connection.on('connected', () => {
      logger.info(`Mongoose default connection is open to ${uri}`);
      console.log(`Mongoose default connection is open to ${uri}`);
      resolve(mongoose.connection)
    });
  });

};