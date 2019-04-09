const router = require('express-imp-router');
module.exports = {
  '/': {
    _middleware_: {
      controller: "errorHandler#routeErrors",
      level: router.MIDDLEWARE_LEVEL.ERROR
    },
    _static_: {
      targets: ['src/public']
    }
  },
  '/upload': {
    post: {
      controller: 'UploadController',
      action: 'save',
      _middleware_: {
        controllers: [require('./middlewares/upload')],
        level: router.MIDDLEWARE_LEVEL.APP,
      }
    }
  },
  '/receipts': {
    get: {
      _middleware_: {
        controllers: ['auth#basicAuth'],
        level: router.MIDDLEWARE_LEVEL.APP
      },
      controller: 'ReceiptController', action: 'get'
    }
  }
};