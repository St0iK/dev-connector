const Log4js = require('log4js');

module.exports = ({ config }) => {
  console.log({ config });
  Log4js.configure(config.logging);

  return Log4js.getLogger('cheese');
};
