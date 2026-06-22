const { sendSuccess, sendError } = require('../utils/response');
const ProjectService = require('../services/ProjectService');

class ProjectController {
  static async createProject(req, res, next) {
    try {
      const lecturerId = req.user.userId;
      const projectData = req.body;

      const project = await ProjectService.createProject(projectData, lecturerId);

      sendSuccess(res, 'Project created successfully', project, 201);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status, error.errors);
      } else {
        next(error);
      }
    }
  }

  static async getAllProjects(req, res, next) {
    try {
      const { page = 1, limit = 10, status, lecturerId, category } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (lecturerId) filters.lecturerId = lecturerId;
      if (category) filters.category = category;

      const result = await ProjectService.getAllProjects(
        parseInt(page),
        parseInt(limit),
        filters
      );

      sendSuccess(res, 'Projects fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req, res, next) {
    try {
      const { projectId } = req.params;

      const project = await ProjectService.getProjectById(projectId);

      sendSuccess(res, 'Project fetched successfully', project);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async updateProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const updateData = req.body;

      const project = await ProjectService.updateProject(projectId, updateData);

      sendSuccess(res, 'Project updated successfully', project);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { projectId } = req.params;

      const result = await ProjectService.deleteProject(projectId);

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async addMember(req, res, next) {
    try {
      const { projectId } = req.params;
      const { userId, role = 'member' } = req.body;

      const project = await ProjectService.addMember(projectId, userId, role);

      sendSuccess(res, 'Member added successfully', project);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async removeMember(req, res, next) {
    try {
      const { projectId, memberId } = req.params;

      const project = await ProjectService.removeMember(projectId, memberId);

      sendSuccess(res, 'Member removed successfully', project);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getProjectsByUser(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.userId;

      const result = await ProjectService.getProjectsByUserId(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      sendSuccess(res, 'Projects fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
