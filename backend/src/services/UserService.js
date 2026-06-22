const User = require('../models/User');

class UserService {
  static async getAllUsers(role = null, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const query = role ? { role } : {};

      const users = await User.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password');

      const total = await User.countDocuments(query);

      return {
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, updateData) {
    try {
      const allowedFields = ['fullName', 'phone', 'department', 'profileImage'];
      const updates = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      const isPasswordMatch = await user.comparePassword(currentPassword);

      if (!isPasswordMatch) {
        throw {
          status: 400,
          message: 'Current password is incorrect',
        };
      }

      user.password = newPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async getLecturers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const lecturers = await User.find({ role: 'lecturer' })
        .skip(skip)
        .limit(limit)
        .select('-password');

      const total = await User.countDocuments({ role: 'lecturer' });

      return {
        lecturers,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getStudents(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const students = await User.find({ role: 'student' })
        .skip(skip)
        .limit(limit)
        .select('-password');

      const total = await User.countDocuments({ role: 'student' });

      return {
        students,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
