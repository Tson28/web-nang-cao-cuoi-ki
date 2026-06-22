const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, ProjectController.createProject);
router.get('/', authenticate, ProjectController.getAllProjects);
router.get('/my-projects', authenticate, ProjectController.getProjectsByUser);
router.get('/:projectId', authenticate, ProjectController.getProjectById);
router.put('/:projectId', authenticate, ProjectController.updateProject);
router.delete('/:projectId', authenticate, ProjectController.deleteProject);
router.post('/:projectId/members', authenticate, ProjectController.addMember);
router.delete('/:projectId/members/:memberId', authenticate, ProjectController.removeMember);

module.exports = router;
