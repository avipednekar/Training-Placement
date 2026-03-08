export const validateStudentLogin = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCompanyLogin = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStudentRegister = (formData) => {
  const errors = {};

  if (!formData.fullName) {
    errors.fullName = "Full name is required";
  }

  if (!formData.email) {
    errors.email = "Email is required";
  }

  if (!formData.rollNo) {
    errors.rollNo = "Roll number is required";
  }

  if (!formData.branch) {
    errors.branch = "Branch is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password should be at least 6 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCompanyRegister = (formData) => {
  const errors = {};

  if (!formData.companyName) {
    errors.companyName = "Company name is required";
  }

  if (!formData.email) {
    errors.email = "Work email is required";
  }

  if (!formData.location) {
    errors.location = "Location is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password should be at least 6 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

