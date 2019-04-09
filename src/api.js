const express = require('express');
const router = require('express-imp-router');

const path = require('path');
const app = express();

const rootpath = path.resolve('.');

router(app);
router.route([
  {
    controllers: `${rootpath}/src/controllers`,
    middlewares: `${rootpath}/src/middlewares`,
    routes: require('./routes.js'),
  }
]);

app.listen(8080);