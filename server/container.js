const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const router = require('./http/router');
const Application = require('./app/Application');
const Server = require('./http/Server');
const logger = require('./logging/logger');
const config = require('../config/index');
const database = require('./database');
const loggerMiddleware = require('./logging/loggerMiddleware');
const errorHandler = require('./http/errors/errorHandler');
const devErrorHandler = require('./http/errors/devErrorHandler');
const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton(),
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton(),
    config: asValue(config),
    loggerMiddleware: asFunction(loggerMiddleware).singleton(),
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    database: asFunction(database),
  });

module.exports = container;
