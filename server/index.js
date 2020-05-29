const container = require('./container');

const app = container.resolve('app');
console.log('running');
app
  .start()
  .catch((error) => {
    console.log({ error });
    app.logger.error(error.stack);
    process.exit();
  });