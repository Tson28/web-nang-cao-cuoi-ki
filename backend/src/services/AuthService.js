const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin, validateChangePassword } = require('../validators/authValidator');

class AuthService {
  /**
   * Register new user
   */
  static async register(userData) {
    try {
      // Validate input
      const { isValid, errors } = validateRegister(userData);
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw {
          status: 400,
          message: 'Email already registered',
          errors: { email: 'This email is already in use' },
        };
      }

      // Create new user
      const user = new User({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        avatar: userData.avatar || null,
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id, user.role);

      return {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(email, password) {
    try {
      // Validate input
      const { isValid, errors } = validateLogin({ email, password });
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      // Find user and select password field
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw {
          status: 401,
          message: 'Invalid email or password',
        };
      }

      // Check if user is active
      if (!user.isActive) {
        throw {
          status: 403,
          message: 'User account is inactive',
        };
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw {
          status: 401,
          message: 'Invalid email or password',
        };
      }

      // Generate token
      const token = this.generateToken(user._id, user.role);

      return {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user by ID
   */
  static async getCurrentUser(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      if (!user.isActive) {
        throw {
          status: 403,
          message: 'User account is inactive',
        };
      }

      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Validate input
      const { isValid, errors } = validateChangePassword({
        currentPassword,
        newPassword,
      });
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      // Find user with password field
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      // Verify current password
      const isPasswordMatch = await user.comparePassword(currentPassword);

      if (!isPasswordMatch) {
        throw {
          status: 401,
          message: 'Current password is incorrect',
        };
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  static generateToken(userId, role) {
    const payload = {
      userId,
      role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw {
        status: 401,
        message: 'Invalid or expired token',
      };
    }
  }

  /**
   * Refresh token
   */
  static refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const newToken = this.generateToken(decoded.userId, decoded.role);
      return newToken;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
