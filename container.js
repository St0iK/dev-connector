const router = require('./routes/api/users');

const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { scopePerRequest } = require('awilix-express');

const Application = require('./app/Application');
const Server = require('./http/Server');
const logger = require('./logging/logger');
const config = require('./config/index');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });

// Middlewares
container.register({
  containerMiddleware: asValue(scopePerRequest(container)),
});

// Database
container.register({
  database: asValue(database),
  UserModel: asValue(UserModel)
});

module.exports = container;
