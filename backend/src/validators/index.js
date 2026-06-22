const validateEmail = (email) => {
  const re =
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUserInput = (data) => {
  const errors = {};

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateProjectInput = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Project title is required';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Project description is required';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    errors.endDate = 'End date must be after start date';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateTaskInput = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Task title is required';
  }

  if (!data.projectId) {
    errors.projectId = 'Project ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserInput,
  validateProjectInput,
  validateTaskInput,
};
