const Task = require('../models/Task');
const { validateTaskInput } = require('../validators');

class TaskService {
  static async createTask(taskData) {
    try {
      const { isValid, errors } = validateTaskInput(taskData);
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      const task = new Task(taskData);
      await task.save();
      await task.populate('assignees.userId', '-password');

      return task;
    } catch (error) {
      throw error;
    }
  }

  static async getTasksByProjectId(projectId, page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { projectId };

      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.assignedTo) {
        query['assignees.userId'] = filters.assignedTo;
      }

      const tasks = await Task.find(query)
        .skip(skip)
        .limit(limit)
        .populate('assignees.userId', '-password')
        .sort({ priority: -1, dueDate: 1 });

      const total = await Task.countDocuments(query);

      return {
        tasks,
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

  static async getTaskById(taskId) {
    try {
      const task = await Task.findById(taskId).populate(
        'assignees.userId',
        '-password'
      );

      if (!task) {
        throw {
          status: 404,
          message: 'Task not found',
        };
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  static async updateTask(taskId, updateData) {
    try {
      const allowedFields = [
        'title',
        'description',
        'priority',
        'status',
        'startDate',
        'dueDate',
        'estimatedHours',
        'actualHours',
        'progress',
      ];
      const updates = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const task = await Task.findByIdAndUpdate(taskId, updates, {
        new: true,
        runValidators: true,
      }).populate('assignees.userId', '-password');

      if (!task) {
        throw {
          status: 404,
          message: 'Task not found',
        };
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  static async deleteTask(taskId) {
    try {
      const task = await Task.findByIdAndDelete(taskId);

      if (!task) {
        throw {
          status: 404,
          message: 'Task not found',
        };
      }

      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async assignTask(taskId, userId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw {
          status: 404,
          message: 'Task not found',
        };
      }

      const assigneeExists = task.assignees.some((a) =>
        a.userId.equals(userId)
      );

      if (assigneeExists) {
        throw {
          status: 400,
          message: 'User is already assigned to this task',
        };
      }

      task.assignees.push({ userId });
      await task.save();
      await task.populate('assignees.userId', '-password');

      return task;
    } catch (error) {
      throw error;
    }
  }

  static async removeAssignee(taskId, userId) {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw {
          status: 404,
          message: 'Task not found',
        };
      }

      task.assignees = task.assignees.filter((a) =>
        !a.userId.equals(userId)
      );

      await task.save();
      await task.populate('assignees.userId', '-password');

      return task;
    } catch (error) {
      throw error;
    }
  }

  static async getTasksByAssignee(userId, page = 1, limit = 10, status = null) {
    try {
      const skip = (page - 1) * limit;
      const query = { 'assignees.userId': userId };

      if (status) {
        query.status = status;
      }

      const tasks = await Task.find(query)
        .skip(skip)
        .limit(limit)
        .populate('assignees.userId', '-password')
        .sort({ priority: -1, dueDate: 1 });

      const total = await Task.countDocuments(query);

      return {
        tasks,
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

module.exports = TaskService;
