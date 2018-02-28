const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

function isValid(str) { return /^\w+$/.test(str); }

function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';
  //console.log(payload)

  if (!payload || typeof payload.firstname !== 'string' || payload.firstname.trim().length === 0) {
    //|| !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.firstname = 'Please provide a first name.';
  }

  if (!payload || typeof payload.lastname !== 'string' || payload.lastname.trim().length === 0) {
    //|| !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.lastname = 'Please provide a last name.';
  }

  if (!payload || typeof payload.passone !== 'string' || payload.passone.trim().length < 2) {
    isFormValid = false;
    errors.passone = 'Password must have at least 2 characters.';
  }

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Please provide a username.';
  }

  if (!isValid(payload.username)) {
    isFormValid = false;
    errors.username = 'Username must contain only letters and numbers.';
  }

  if (!payload || payload.passone.trim() !== payload.passtwo.trim()) {
    isFormValid = false;
    errors.passtwo = 'Passwords must match.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/register', (req, res, next) => {

  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-signup', (err, token, userData) => {
    if (err) {
      if (err.name === 'BulkWriteError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Form contains issues',
          errors: {
            username: 'Username is taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form, try again.'
      });
    }

    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});


router.post('/login', (req, res, next) => {

  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form, try again.'
      });
    }

    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});


router.use((req,res) => {
  return res.status(400).json({
    success: false
  });
})


module.exports = router;