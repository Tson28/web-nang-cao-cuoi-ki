const Project = require('../models/Project');
const { validateProjectInput } = require('../validators');

class ProjectService {
  static async createProject(projectData, lecturerId) {
    try {
      const { isValid, errors } = validateProjectInput(projectData);
      if (!isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors,
        };
      }

      const project = new Project({
        ...projectData,
        lecturerId,
        members: [
          {
            userId: lecturerId,
            role: 'leader',
          },
        ],
      });

      await project.save();
      await project.populate('lecturerId', '-password');
      await project.populate('members.userId', '-password');

      return project;
    } catch (error) {
      throw error;
    }
  }

  static async getAllProjects(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (filters.status) query.status = filters.status;
      if (filters.lecturerId) query.lecturerId = filters.lecturerId;
      if (filters.category) query.category = filters.category;

      const projects = await Project.find(query)
        .skip(skip)
        .limit(limit)
        .populate('lecturerId', '-password')
        .populate('members.userId', '-password');

      const total = await Project.countDocuments(query);

      return {
        projects,
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

  static async getProjectById(projectId) {
    try {
      const project = await Project.findById(projectId)
        .populate('lecturerId', '-password')
        .populate('members.userId', '-password');

      if (!project) {
        throw {
          status: 404,
          message: 'Project not found',
        };
      }

      return project;
    } catch (error) {
      throw error;
    }
  }

  static async updateProject(projectId, updateData) {
    try {
      const allowedFields = [
        'title',
        'description',
        'startDate',
        'endDate',
        'status',
        'category',
        'gitRepository',
        'documentUrl',
      ];
      const updates = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const project = await Project.findByIdAndUpdate(projectId, updates, {
        new: true,
        runValidators: true,
      })
        .populate('lecturerId', '-password')
        .populate('members.userId', '-password');

      if (!project) {
        throw {
          status: 404,
          message: 'Project not found',
        };
      }

      return project;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProject(projectId) {
    try {
      const project = await Project.findByIdAndDelete(projectId);

      if (!project) {
        throw {
          status: 404,
          message: 'Project not found',
        };
      }

      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async addMember(projectId, userId, role = 'member') {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw {
          status: 404,
          message: 'Project not found',
        };
      }

      const memberExists = project.members.some((m) =>
        m.userId.equals(userId)
      );

      if (memberExists) {
        throw {
          status: 400,
          message: 'User is already a member of this project',
        };
      }

      project.members.push({
        userId,
        role,
      });

      await project.save();
      await project.populate('members.userId', '-password');

      return project;
    } catch (error) {
      throw error;
    }
  }

  static async removeMember(projectId, userId) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw {
          status: 404,
          message: 'Project not found',
        };
      }

      project.members = project.members.filter(
        (m) => !m.userId.equals(userId)
      );

      await project.save();
      await project.populate('members.userId', '-password');

      return project;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectsByUserId(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const projects = await Project.find({
        $or: [
          { lecturerId: userId },
          { 'members.userId': userId },
        ],
      })
        .skip(skip)
        .limit(limit)
        .populate('lecturerId', '-password')
        .populate('members.userId', '-password');

      const total = await Project.countDocuments({
        $or: [
          { lecturerId: userId },
          { 'members.userId': userId },
        ],
      });

      return {
        projects,
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

module.exports = ProjectService;
