const express = require('express');
const router = require('express-imp-router');
const path = require('path');

const app = express();
const rootpath = path.resolve('.');

router(app);
router.enableDebug();
router.route([
  {
    routes: `${rootpath}/src/routes.json`,
    controllers: `${rootpath}/src/controllers`,
    middlewares: `${rootpath}/src/middlewares`,
    services: `${rootpath}/src/services/`,
  }
]);

app.listen(8080);