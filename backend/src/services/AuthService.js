const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUserInput } = require('../validators');

class AuthService {
  static async register(userData) {
    try {
      // Validate input
      const { isValid, errors } = validateUserInput(userData);
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
          message: 'User with this email already exists',
        };
      }

      // Create new user
      const user = new User({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        studentId: userData.studentId,
        role: userData.role || 'student',
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
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      if (!email || !password) {
        throw {
          status: 400,
          message: 'Please provide email and password',
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

      // Check password
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw {
          status: 401,
          message: 'Invalid email or password',
        };
      }

      if (!user.isActive) {
        throw {
          status: 403,
          message: 'User account is inactive',
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
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);

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

  static generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }
}

module.exports = AuthService;
