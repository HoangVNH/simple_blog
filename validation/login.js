const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  let { email, password } = data;

  // Converting empty fields to empty string as validator function works only with string
  email = isEmpty(email) ? '' : email;
  password = isEmpty(password) ? '' : password;

  if (Validator.isEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!Validator.isEmail(email)) {
    errors.emai = 'Enter a valid email';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password is required';
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
