const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin'), UserController.getAllUsers);
router.get('/lecturers', authenticate, UserController.getLecturers);
router.get('/students', authenticate, UserController.getStudents);
router.get('/:userId', authenticate, UserController.getUserById);
router.put('/:userId', authenticate, UserController.updateUser);
router.delete('/:userId', authenticate, authorize('admin'), UserController.deleteUser);
router.post('/:userId/change-password', authenticate, UserController.changePassword);

module.exports = router;
