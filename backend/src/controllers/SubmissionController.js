const { sendSuccess, sendError } = require('../utils/response');
const SubmissionService = require('../services/SubmissionService');

class SubmissionController {
  static async createSubmission(req, res, next) {
    try {
      const { projectId, title, description, fileUrl, fileSize, submissionType } = req.body;
      const submittedBy = req.user.userId;

      const submission = await SubmissionService.createSubmission({
        projectId,
        submittedBy,
        title,
        description,
        fileUrl,
        fileSize,
        submissionType,
      });

      sendSuccess(res, 'Submission created successfully', submission, 201);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getSubmissionsByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const { page = 1, limit = 10, status, submissionType, submittedBy } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (submissionType) filters.submissionType = submissionType;
      if (submittedBy) filters.submittedBy = submittedBy;

      const result = await SubmissionService.getSubmissionsByProjectId(
        projectId,
        parseInt(page),
        parseInt(limit),
        filters
      );

      sendSuccess(res, 'Submissions fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionById(req, res, next) {
    try {
      const { submissionId } = req.params;

      const submission = await SubmissionService.getSubmissionById(submissionId);

      sendSuccess(res, 'Submission fetched successfully', submission);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async updateSubmission(req, res, next) {
    try {
      const { submissionId } = req.params;
      const updateData = req.body;

      const submission = await SubmissionService.updateSubmission(submissionId, updateData);

      sendSuccess(res, 'Submission updated successfully', submission);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async deleteSubmission(req, res, next) {
    try {
      const { submissionId } = req.params;

      const result = await SubmissionService.deleteSubmission(submissionId);

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async reviewSubmission(req, res, next) {
    try {
      const { submissionId } = req.params;
      const { status, feedback, grade } = req.body;
      const reviewedBy = req.user.userId;

      const submission = await SubmissionService.reviewSubmission(submissionId, {
        status,
        feedback,
        grade,
        reviewedBy,
      });

      sendSuccess(res, 'Submission reviewed successfully', submission);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getMySubmissions(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.userId;

      const result = await SubmissionService.getSubmissionsByUserId(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      sendSuccess(res, 'Submissions fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubmissionController;
