//Passport.js is an authentication middleware used for Node.js that offers multiple strategies for authenticating users. 

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');


let Users = Models.users,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, users) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!users) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username.'});
    }

    if (!users.validatePassword(password)) {
      console.log("incorrect password");
      return callback(null, false, {message: "Incorrect password."});
    }

    console.log('finished');
    return callback(null, users);
  });
}));


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((users) => {
      return callback(null, users);
    })
    .catch((error) => {
      return callback(error)
    });
}));
