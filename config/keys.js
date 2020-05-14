if (process.env.NODE_ENV === 'production') {
  module.exports = require('./keys_prod')
}

module.exports = require('./keys_dev')