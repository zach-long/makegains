'use strict';

// modules
const express = require('express');
const passport = require('passport');

// constants
const router = express.Router();
const LocalStrategy = require('passport-local').Strategy;

// import models
const User = require('../models/user.js');
const Workout = require('../models/workout.js');
const Exercise = require('../models/exercise.js');

// local authentication strategy
const localStrat = new LocalStrategy((username, password, done) => {
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

// set 'local' authentication to use the LocalStrategy
passport.use('local', localStrat);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

// post request for user to create an account
router.post('/signup', (req, res) => {
  // validate
  req.checkBody('name', 'Please enter a name').notEmpty();
  req.checkBody('username', 'Please enter a username').notEmpty();
  req.checkBody('email', 'Please enter your email').notEmpty();
  req.checkBody('email', 'You must enter a valid email address').isEmail();
  req.checkBody('password', 'You must enter a password').notEmpty();
  req.checkBody('password2', 'The passwords you entered do not match').equals(req.body.password);

  // handle errors or proceed
  if (req.validationErrors()) {
    // send validation errors
    req.getValidationResult().then((validationResult) => {
      res.json(validationResult.array());
    });

  } else {
    // create a user and save to database
    let newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    User.createUser(newUser, (err, theUser) => {
      if (err) throw err
    });

    req.flash('success', 'Account created successfully!');
    console.log(newUser);
    res.json(newUser);
  }

});

// post request to log in a registered user
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = router;
