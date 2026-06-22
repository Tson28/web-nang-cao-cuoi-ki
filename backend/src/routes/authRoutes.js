const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/auth');

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', verifyToken, AuthController.getCurrentUser);
router.put('/change-password', verifyToken, AuthController.changePassword);
router.get('/verify-token', verifyToken, AuthController.verifyToken);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;
