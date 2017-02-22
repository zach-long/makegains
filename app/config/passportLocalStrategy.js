const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

// local authentication strategy
var localStrategy = new LocalStrategy((username, password, done) => {
  // check database for user
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err

    if (!user) {
      return done(null, false, {message: 'Unknown username'});
    }

    // see if 'found user' password matches provided password
    User.comparePassword(password, user.password, (err, match) => {
      if (err) throw err

      if (!match) {
        return done(null, false, {message: 'Incorrect password'});

      } else {
        return done(null, user);
      }
    });
  });
});

module.exports = localStrategy;
