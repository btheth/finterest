const jwt = require('jsonwebtoken');
const User = require('mongoose').model('users');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {

  if (!req.headers.authorization && (req.url.split('/')[2] === "cust" || req.url.split('/')[2] === "emp" || req.url.split('/')[2] === "admin")) {
    return res.status(401).json({error:"unauthorized access"});
  } else if (req.url.split('/')[2] === "cust" || req.url.split('/')[2] === "emp" || req.url.split('/')[2] === "admin") {
    
    const token = req.headers.authorization;

    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) { return res.status(401).end(); }

      const userId = decoded.sub;

      return User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          return res.status(401).end();
        }

        const userType = user.type;

        if (req.url.split('/')[2] === "emp" && userType !== "emp") {
          return res.status(401).json({error:"unauthorized access"});
        } else if (req.url.split('/')[2] === "admin" && userType !== "admin") {
          return res.status(401).json({error:"unauthorized access"});
        } else if (req.url.split('/')[2] === "cust" && userType !== "user") {
          return res.status(401).json({error:"unauthorized access"});
        }

        return next();

      });
    });  

  } else {
    return next();
  }
};