const { sendSuccess, sendError } = require('../utils/response');
const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { fullName, email, password, role, avatar } = req.body;

      const result = await AuthService.register({
        fullName,
        email,
        password,
        role,
        avatar,
      });

      sendSuccess(
        res,
        'User registered successfully',
        result,
        201
      );
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status, error.errors || error.data);
      } else {
        next(error);
      }
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      sendSuccess(res, 'Login successful', result);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status, error.errors);
      } else {
        next(error);
      }
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  static async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.userId;

      const user = await AuthService.getCurrentUser(userId);

      sendSuccess(res, 'User fetched successfully', user);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  static async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status, error.errors);
      } else {
        next(error);
      }
    }
  }

  /**
   * Verify token
   * GET /api/auth/verify-token
   */
  static async verifyToken(req, res, next) {
    try {
      const user = req.user;
      sendSuccess(res, 'Token is valid', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   * POST /api/auth/refresh-token
   */
  static async refreshToken(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return sendError(res, 'Token is required', 400);
      }

      const newToken = AuthService.refreshToken(token);

      sendSuccess(res, 'Token refreshed successfully', { token: newToken });
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }
}

module.exports = AuthController;
