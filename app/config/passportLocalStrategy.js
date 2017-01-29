const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

// local authentication strategy
var localStrategy = new LocalStrategy((username, password, done) => {
  console.log("use local strategy")
  console.log(username);
  console.log(password);
  // check database for user
  User.getUserByUsername(username, (err, user) => {
    console.log('got user')
    if (err) throw err

    if (!user) {
      return done(null, false, {message: 'Unknown username'});
    }

    // see if 'found user' password matches provided password
    User.comparePassword(password, user.password, (err, match) => {
      console.log("compare password")
      if (err) throw err

      if (!match) {
        console.log('user password doesnt match')
        return done(null, false, {message: 'Incorrect password'});

      } else {
        console.log('user matches')
        return done(null, user);
      }
    });
  });
});

module.exports = localStrategy;
