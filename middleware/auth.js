// middleware/auth.js

// const { expressjwt: expressJwt } = require('express-jwt');

// const authenticateJwt = expressJwt({
//   secret: process.env.TOP_SECRET_KEY,
//   algorithms: ['HS256'],
//   requestProperty: 'auth',
// });

// module.exports = authenticateJwt;

const { expressjwt: expressJwt } = require('express-jwt');

const authenticateJwt = expressJwt({
  secret: process.env.JWT_SECRET,   // Your JWT secret
  algorithms: ['HS256'],                // Algorithm used to sign the JWT
  requestProperty: 'auth',              // Where the decoded token will be attached (req.auth)
  getToken: (req) => {
    if (req.cookies && req.cookies.jwt) {
      return req.cookies.jwt; // Return the token from the cookie
    }
    return null; // No token found
  },
});

module.exports = authenticateJwt;

