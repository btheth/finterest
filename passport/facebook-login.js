const jwt = require('jsonwebtoken');
const User = require('mongoose').model('users');
const FacebookStrategy = require('passport-facebook').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new FacebookStrategy({
  clientID: process.env.FB_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: process.env.FB_CALLBACK,
  session: false,
}, (token, refreshToken, profile, done) => {
  // find a user by username
  return User.findOne({ 'facebook.id' : profile.id }, (err, user) => {

    if (err) { return done(err); }

    if (user) {
      const payload = {
        sub: user._id
      };

      const token = {token: jwt.sign(payload, process.env.JWTSECRET), id: user._id};
      const data = {
        username: user.username
      };

      return done(null, token, data);
    } else {

      const newUser = new User();

      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.firstname = profile.name.givenName
      newUser.lastname = profile.name.familyName;
      newUser.username = profile.name.givenName + profile.name.familyName.substring(0,1) + (Math.floor(Math.random() * 10000) + 1);
      
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
    }

    if (!user) {
      const error = new Error('Incorrect username or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }
  });
});