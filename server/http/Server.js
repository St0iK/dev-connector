const express = require('express');

class Server {
  constructor({ config, router, logger }) {
    this.config = config;
    this.logger = logger;
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(router);
  }

  start() {
    return new Promise((resolve) => {
      console.log('About to start express!');
      const http = this.express
        .listen(this.config.web.port, () => {
          console.log(http.address());
          const { port } = http.address();
          this.logger.info(`[p ${process.pid}] Listening at port ${port}`);
          resolve();
        });
    });
  }
}

module.exports = Server;
