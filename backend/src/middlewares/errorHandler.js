const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${status}: ${message}`);
  console.error(err);

  sendError(res, message, status, {
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
};

const notFoundHandler = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  sendError(res, message, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
