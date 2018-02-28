const jwt = require('jsonwebtoken');
const User = require('mongoose').model('users');
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'passone',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {

  const userData = {
    username: username.trim(),
    password: password.trim(),
    email: req.body.email.trim(),
    firstname: req.body.firstname.trim(),
    lastname: req.body.lastname.trim()
  };

  const newUser = new User(userData);

  newUser.save((err) => {
      if (err) { return done(err); };
      
      const payload = {
        sub: newUser._id
      };
      
      // create a token string
      const token = {token: jwt.sign(payload, process.env.JWTSECRET), id: newUser._id};

      const data = {
        username: newUser.username
      };

      return done(null, token, data);
  });
});