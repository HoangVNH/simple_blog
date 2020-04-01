const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports.validatePostInput = data => {
  let errors = {};

  let { title, body } = data;

  title = isEmpty(titile) ? '' : title;
  body = isEmpty(body) ? '' : body;

  if (Validator.isEmpty(title)) {
    errors.title = 'Title is required';
  }

  if (Validator.isEmpty(body)) {
    errors.body = 'Body is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
