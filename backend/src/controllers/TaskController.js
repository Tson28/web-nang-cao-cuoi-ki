const { sendSuccess, sendError } = require('../utils/response');
const TaskService = require('../services/TaskService');

class TaskController {
  static async createTask(req, res, next) {
    try {
      const taskData = req.body;

      const task = await TaskService.createTask(taskData);

      sendSuccess(res, 'Task created successfully', task, 201);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status, error.errors);
      } else {
        next(error);
      }
    }
  }

  static async getTasksByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const { page = 1, limit = 10, status, priority, assignedTo } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (assignedTo) filters.assignedTo = assignedTo;

      const result = await TaskService.getTasksByProjectId(
        projectId,
        parseInt(page),
        parseInt(limit),
        filters
      );

      sendSuccess(res, 'Tasks fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const { taskId } = req.params;

      const task = await TaskService.getTaskById(taskId);

      sendSuccess(res, 'Task fetched successfully', task);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const updateData = req.body;

      const task = await TaskService.updateTask(taskId, updateData);

      sendSuccess(res, 'Task updated successfully', task);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const result = await TaskService.deleteTask(taskId);

      sendSuccess(res, result.message, {});
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async assignTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const { userId } = req.body;

      const task = await TaskService.assignTask(taskId, userId);

      sendSuccess(res, 'Task assigned successfully', task);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async removeAssignee(req, res, next) {
    try {
      const { taskId, assigneeId } = req.params;

      const task = await TaskService.removeAssignee(taskId, assigneeId);

      sendSuccess(res, 'Assignee removed successfully', task);
    } catch (error) {
      if (error.status) {
        sendError(res, error.message, error.status);
      } else {
        next(error);
      }
    }
  }

  static async getMyTasks(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const userId = req.user.userId;

      const result = await TaskService.getTasksByAssignee(
        userId,
        parseInt(page),
        parseInt(limit),
        status
      );

      sendSuccess(res, 'Tasks fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
