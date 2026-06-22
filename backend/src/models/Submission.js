const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a submission title'],
      trim: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    submissionType: {
      type: String,
      enum: ['proposal', 'progress-report', 'final-submission', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['submitted', 'approved', 'rejected', 'needs-revision'],
      default: 'submitted',
    },
    feedback: {
      type: String,
    },
    grade: {
      type: Number,
      min: 0,
      max: 10,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
