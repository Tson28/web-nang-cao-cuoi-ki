const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, TaskController.createTask);
router.get('/my-tasks', authenticate, TaskController.getMyTasks);
router.get('/project/:projectId', authenticate, TaskController.getTasksByProject);
router.get('/:taskId', authenticate, TaskController.getTaskById);
router.put('/:taskId', authenticate, TaskController.updateTask);
router.delete('/:taskId', authenticate, TaskController.deleteTask);
router.post('/:taskId/assign', authenticate, TaskController.assignTask);
router.delete('/:taskId/assignee/:assigneeId', authenticate, TaskController.removeAssignee);

module.exports = router;
