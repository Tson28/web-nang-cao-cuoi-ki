const { sendSuccess, sendError } = require('../utils/response');
const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { fullName, email, password, phone, studentId, role } = req.body;

      const result = await AuthService.register({
        fullName,
        email,
        password,
        phone,
        studentId,
        role,
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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      sendSuccess(res, 'Login successful', result);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const user = await AuthService.getUserById(userId);

      sendSuccess(res, 'Profile fetched successfully', user);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async verifyToken(req, res, next) {
    try {
      const user = req.user;
      sendSuccess(res, 'Token is valid', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
