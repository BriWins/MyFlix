-----------------------------------------Authentication Logic-------------------------------------------------

//same key used in JWTStrategy
  
const jwtSecret = 'your_jwt_secret'; 
const jwt = require('jsonwebtoken'),
  passport = require('passport');

//importing local passport file

require('./passport'); 

-----------------------------------------JWT Implementation-------------------------------------------------
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,        //The username being encoded during authentication process
    expiresIn: '7d',              //The token is set to expire in seven days
    algorithm: 'HS256'           //standard algorithm used to encode value of the JWT
  });
}


//function allows registered user to login simultaneously verifying their credentials or otherwise denies the request

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
