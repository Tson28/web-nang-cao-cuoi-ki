const { sendSuccess, sendError } = require('../utils/response');
const UserService = require('../services/UserService');

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const { role, page = 1, limit = 10 } = req.query;

      const result = await UserService.getAllUsers(role, parseInt(page), parseInt(limit));

      sendSuccess(res, 'Users fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);

      sendSuccess(res, 'User fetched successfully', user);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await UserService.updateUser(userId, updateData);

      sendSuccess(res, 'User updated successfully', user);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      const result = await UserService.deleteUser(userId);

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;

      const result = await UserService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getLecturers(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await UserService.getLecturers(parseInt(page), parseInt(limit));

      sendSuccess(res, 'Lecturers fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getStudents(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await UserService.getStudents(parseInt(page), parseInt(limit));

      sendSuccess(res, 'Students fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
