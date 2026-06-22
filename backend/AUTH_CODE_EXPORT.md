# Authentication Module - Complete Code Export

## 1. User Model (src/models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'lecturer', 'admin'],
        message: 'Role must be student, lecturer, or admin',
      },
      default: 'student',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
```

---

## 2. Auth Validator (src/validators/authValidator.js)

```javascript
const validateEmail = (email) => {
  const re =
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegister = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  const validRoles = ['student', 'lecturer', 'admin'];
  if (data.role && !validRoles.includes(data.role)) {
    errors.role = 'Role must be student, lecturer, or admin';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateChangePassword = (data) => {
  const errors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!data.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!validatePassword(data.newPassword)) {
    errors.newPassword = 'New password must be at least 6 characters';
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegister,
  validateLogin,
  validateChangePassword,
};
```

---

## 3. Auth Service (src/services/AuthService.js)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin, validateChangePassword } = require('../validators/authValidator');

class AuthService {
  static async register(userData) {
    try {
      const { isValid, errors } = validateRegister(userData);
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw {
          status: 400,
          message: 'Email already registered',
          errors: { email: 'This email is already in use' },
        };
      }

      const user = new User({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        avatar: userData.avatar || null,
      });

      await user.save();

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

  static async login(email, password) {
    try {
      const { isValid, errors } = validateLogin({ email, password });
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
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

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw {
          status: 401,
          message: 'Invalid email or password',
        };
      }

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

  static async changePassword(userId, currentPassword, newPassword) {
    try {
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
          status: 401,
          message: 'Current password is incorrect',
        };
      }

      user.password = newPassword;
      await user.save();

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  static generateToken(userId, role) {
    const payload = {
      userId,
      role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });
  }

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
```

---

## 4. Auth Middleware (src/middlewares/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const verifyToken = (req, res, next) => {
  try {
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

const authenticate = verifyToken;
const authorize = authorizeRole;

module.exports = {
  verifyToken,
  authorizeRole,
  authenticate,
  authorize,
};
```

---

## 5. Auth Controller (src/controllers/AuthController.js)

```javascript
const { sendSuccess, sendError } = require('../utils/response');
const AuthService = require('../services/AuthService');

class AuthController {
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

  static async verifyToken(req, res, next) {
    try {
      const user = req.user;
      sendSuccess(res, 'Token is valid', user);
    } catch (error) {
      next(error);
    }
  }

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
```

---

## 6. Auth Routes (src/routes/authRoutes.js)

```javascript
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', verifyToken, AuthController.getCurrentUser);
router.put('/change-password', verifyToken, AuthController.changePassword);
router.get('/verify-token', verifyToken, AuthController.verifyToken);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;
```

---

## Summary

**File Structure:**
- ✅ User Model (Updated)
- ✅ Auth Validator (Created)
- ✅ Auth Service (Updated)
- ✅ Auth Middleware (Updated)
- ✅ Auth Controller (Updated)
- ✅ Auth Routes (Updated)

**Key Features:**
- ✅ Register (Email, Password, Role)
- ✅ Login (Email, Password)
- ✅ JWT Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ Get Current User
- ✅ Change Password
- ✅ Verify Token
- ✅ Refresh Token
- ✅ Role-based Authorization
- ✅ Complete Validation

**Security:**
- ✅ Password Hashing (10 salt rounds)
- ✅ JWT Token (7 days expiration)
- ✅ Input Validation
- ✅ Error Handling
- ✅ Role-based Access Control

**Documentation:**
- ✅ README_AUTH.md - Full API documentation
- ✅ AUTH_EXAMPLES.js - Code examples
- ✅ AUTH_TESTS.js - Test cases
- ✅ POSTMAN_COLLECTION.json - Postman import
- ✅ AUTHENTICATION_MODULE.md - Complete summary
- ✅ AUTH_CODE_EXPORT.md - All code (this file)
