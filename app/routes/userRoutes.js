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

// get request for user profile page
router.get('/', (req, res) => {
  if (req.user) {
    Workout.getOwnWorkouts(req.user, (err, workouts) => {
      if (err) throw err;

      Exercise.getOwnExercises(req.user, (err, exercises) => {
        if (err) throw err;

        res.render('profile', {workouts: workouts, exercises: exercises});
      });
    });

  } else {
    // user is not authenticated
    res.redirect('/');
  }
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
      let errors = validationResult.array();
      res.render('index', {authError: errors});
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

    req.flash('success', 'Account created! You can now sign in.');
    res.redirect('/');
  }

});

// post request to log in a registered user
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = router;
