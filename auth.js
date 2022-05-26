//-----------------------------------------Authentication Logic-------------------------------------------------

//same key used in JWTStrategy
  
const jwtSecret = 'your_jwt_secret'; 
const jwt = require('jsonwebtoken'),
  passport = require('passport');

//importing local passport file

require('./passport'); 

//-----------------------------------------JWT Implementation-------------------------------------------------
let generateJWTToken = (users) => {
  return jwt.sign(users, jwtSecret, {
    subject: users.Username,        //The username being encoded during authentication process
    expiresIn: '7d',              //The token is set to expire in seven days
    algorithm: 'HS256'           //standard algorithm used to encode value of the JWT
  });
}


//function allows registered user to login simultaneously verifying their credentials or otherwise denies the request

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, users, info) => {
      if (error || !users) {
        return res.status(400).json({
          message: 'Something is not right',
          user: users
        });
      }
      req.login(users, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(users.toJSON());
        return res.json({ users, token });
      });
    })(req, res);
  });
}
