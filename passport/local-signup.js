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
    firstname: req.body.firstname.trim().substring(0,1).toUpperCase() + req.body.firstname.trim().substring(1),
    lastname: req.body.lastname.trim().substring(0,1).toUpperCase() + req.body.lastname.trim().substring(1),
    orders: [],
    cart: [],
    type: "user"
  };

  const newUser = new User(userData);

  newUser.save((err) => {
      if (err) { return done(err); };
      
      const payload = {
        sub: newUser._id
      };
      
      // create a token string
      const token = {token: jwt.sign(payload, process.env.JWTSECRET),type:user.type};

      const data = {
        username: newUser.username
      };

      return done(null, token, data);
  });
});