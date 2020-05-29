require('dotenv').config();

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

const envConfig = require(path.join(__dirname, 'environments', ENV));
const dbConfig = loadDbConfig();

const config = Object.assign({
  [ENV]: true,
  env: ENV,
  db: dbConfig || 'mongodb+srv://devconnector:123123123@cluster0-ztwjn.gcp.mongodb.net/test?retryWrites=true&w=majority'
}, envConfig);

module.exports = config;

function loadDbConfig() {
  if (process.env.mongoURI) {
    return process.env.mongoURI;
  }

  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('../server/database')[ENV];
  }
}
