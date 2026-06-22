const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendError(res, 'No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'User not authorized', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
