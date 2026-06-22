const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, SubmissionController.createSubmission);
router.get('/my-submissions', authenticate, SubmissionController.getMySubmissions);
router.get('/project/:projectId', authenticate, SubmissionController.getSubmissionsByProject);
router.get('/:submissionId', authenticate, SubmissionController.getSubmissionById);
router.put('/:submissionId', authenticate, SubmissionController.updateSubmission);
router.delete('/:submissionId', authenticate, SubmissionController.deleteSubmission);
router.post('/:submissionId/review', authenticate, SubmissionController.reviewSubmission);

module.exports = router;
