'use strict';

// modules
const express = require('express');
const expressValidator = require('express-validator');
const passport = require('passport');

// constants
const router = express.Router();
const LocalStrategy = require('passport-local').Strategy;

// import models
const User = require('../models/user.js');
const Program = require('../models/program.js');
const Exercise = require('../models/exercise.js');
const Workout = require('../models/workout.js');

// API request to return the User's object
router.get('/self', (req, res) => {
  User.getUserById(req.user._id, (err, user) => {
    if (err) throw err;
    res.json(user);
  });
});

// API request to return all of a user's programs
router.get('/programs', (req, res) => {
  User.getPrograms(req.user, null, (err, programs) => {
    if (err) throw err;
    res.json(programs);
  });
});

// API request to return a user's workouts by date
router.get('/workouts/:dateStart/:dateEnd', (req, res) => {
  User.getWorkouts(req.user, req.params.dateStart, req.params.dateEnd, (err, workouts) => {
    if (err) throw err;
    res.json(exercises);
  });
});

// API request to return all of a user's workouts
router.get('/workouts', (req, res) => {
  User.getWorkouts(req.user, null, null, (err, workouts) => {
    if (err) throw err;
    res.json(workouts);
  });
});

// API request to return a user's exercises by category
router.get('/exercises/:category', (req, res) => {
  User.getExercises(req.user, req.params.category, (err, exercises) => {
    if (err) throw err;
    res.json(exercises);
  });
});

// API request to return all of a user's exercises
router.get('/exercises', (req, res) => {
  User.getExercises(req.user, null, (err, exercises) => {
    if (err) throw err;
    res.json(exercises);
  });
});

// get request for user profile page
router.get('/', (req, res) => {
  if (req.user) {
    res.render('profile');

  } else {
    // user is not authenticated
    res.redirect('/');
  }
});

router.get('/myexercises', (req, res) => {
  Exercise.getExercisesPromise()
    .then(exercises => {
      res.send(exercises);
    }, (error) => {
      res.send(error);
    });
})

// get request to authenticate
router.get('/authenticate', (req, res) => {
  if (!req.user) {
    res.render('auth');

  } else {
    res.redirect('/user');
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
  req.getValidationResult()
  .then((validationResult) => {
    if (!validationResult.isEmpty()) {
      let errors = validationResult.array();
      res.render('index', {authError: errors});

    } else {
      // create a user and save to database
      let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      User.createUser(newUser, (err, theUser) => {
        if (err && err.name === 'MongoError' && err.code === 11000) {
          // handle duplicate username
          req.flash('fail', 'Username already exists!');
          res.redirect('/');

        } else if (err) {
          console.log(err);

        } else {
          req.flash('success', 'Account created! You can now sign in.');
          res.redirect('/');
        }
      });
    }
  });
});

// post request to log in a registered user
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true
}));

// post request to log out
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// delete a User account
router.get('/delete/:id', (req, res) => {
  User.deleteUser(req.user, (err) => {
    if (err) throw err;

    Exercise.remove({ creator: req.params.id }, (err) => {
      if (err) throw err;

      Workout.remove({ creator: req.params.id }, (err) => {
        if (err) throw err;

        Program.remove({ creator: req.params.id }, (err) => {
          if (err) throw err;

          req.flash('success', 'Your account has been deleted.');
          res.redirect('/');
        });
      });
    });
  });
});

module.exports = router;
