const Submission = require('../models/Submission');

class SubmissionService {
  static async createSubmission(submissionData) {
    try {
      if (!submissionData.projectId || !submissionData.submittedBy || !submissionData.fileUrl) {
        throw {
          status: 400,
          message: 'Project ID, submitted by user, and file URL are required',
        };
      }

      const submission = new Submission(submissionData);
      await submission.save();
      await submission.populate('submittedBy', '-password');
      await submission.populate('reviewedBy', '-password');

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async getSubmissionsByProjectId(projectId, page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { projectId };

      if (filters.status) query.status = filters.status;
      if (filters.submissionType) query.submissionType = filters.submissionType;
      if (filters.submittedBy) query.submittedBy = filters.submittedBy;

      const submissions = await Submission.find(query)
        .skip(skip)
        .limit(limit)
        .populate('submittedBy', '-password')
        .populate('reviewedBy', '-password')
        .sort({ createdAt: -1 });

      const total = await Submission.countDocuments(query);

      return {
        submissions,
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

  static async getSubmissionById(submissionId) {
    try {
      const submission = await Submission.findById(submissionId)
        .populate('submittedBy', '-password')
        .populate('reviewedBy', '-password');

      if (!submission) {
        throw {
          status: 404,
          message: 'Submission not found',
        };
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async updateSubmission(submissionId, updateData) {
    try {
      const allowedFields = [
        'title',
        'description',
        'fileUrl',
        'fileSize',
        'submissionType',
      ];
      const updates = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const submission = await Submission.findByIdAndUpdate(submissionId, updates, {
        new: true,
        runValidators: true,
      })
        .populate('submittedBy', '-password')
        .populate('reviewedBy', '-password');

      if (!submission) {
        throw {
          status: 404,
          message: 'Submission not found',
        };
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSubmission(submissionId) {
    try {
      const submission = await Submission.findByIdAndDelete(submissionId);

      if (!submission) {
        throw {
          status: 404,
          message: 'Submission not found',
        };
      }

      return { message: 'Submission deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async reviewSubmission(submissionId, reviewData) {
    try {
      const submission = await Submission.findById(submissionId);

      if (!submission) {
        throw {
          status: 404,
          message: 'Submission not found',
        };
      }

      submission.status = reviewData.status;
      submission.feedback = reviewData.feedback;
      submission.grade = reviewData.grade;
      submission.reviewedBy = reviewData.reviewedBy;
      submission.reviewedAt = new Date();

      await submission.save();
      await submission.populate('submittedBy', '-password');
      await submission.populate('reviewedBy', '-password');

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async getSubmissionsByUserId(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const submissions = await Submission.find({ submittedBy: userId })
        .skip(skip)
        .limit(limit)
        .populate('submittedBy', '-password')
        .populate('reviewedBy', '-password')
        .sort({ createdAt: -1 });

      const total = await Submission.countDocuments({ submittedBy: userId });

      return {
        submissions,
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

module.exports = SubmissionService;
