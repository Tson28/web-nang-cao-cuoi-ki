const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

/**
 * Middleware to verify JWT token
 * Checks if token exists and is valid
 * Attaches user info to req.user
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'No token provided', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 'Token has expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401);
      }
      return sendError(res, 'Token verification failed', 401);
    }
  } catch (error) {
    sendError(res, 'Unauthorized', 401);
  }
};

/**
 * Middleware to authorize based on user role
 * Allows access only if user has one of the specified roles
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        return sendError(
          res,
          `Access denied. Required role: ${allowedRoles.join(', ')}`,
          403
        );
      }

      next();
    } catch (error) {
      sendError(res, 'Authorization failed', 403);
    }
  };
};

/**
 * Legacy alias for backward compatibility
 */
const authenticate = verifyToken;

/**
 * Legacy alias for backward compatibility
 */
const authorize = authorizeRole;

module.exports = {
  verifyToken,
  authorizeRole,
  authenticate,
  authorize,
};
