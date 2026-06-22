/**
 * Validators for Authentication
 */

const validateEmail = (email) => {
  const re =
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegister = (data) => {
  const errors = {};

  // Validate fullName
  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Validate role (optional, default is student)
  const validRoles = ['student', 'lecturer', 'admin'];
  if (data.role && !validRoles.includes(data.role)) {
    errors.role = 'Role must be student, lecturer, or admin';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateChangePassword = (data) => {
  const errors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!data.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!validatePassword(data.newPassword)) {
    errors.newPassword = 'New password must be at least 6 characters';
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegister,
  validateLogin,
  validateChangePassword,
};
