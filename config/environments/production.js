module.exports = {
  web: {
    port: process.env.PORT
  },
  logging: {
    appenders: { cheese: { type: 'console' } },
  }
};
