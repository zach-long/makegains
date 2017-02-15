'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import models
const User = require('../models/user.js');
const Workout = require('../models/workout.js');
const Exercise = require('../models/exercise.js');

// GET request to show the details of a logged workout
router.get('/detail/:id', (req, res) => {
  Workout.getWorkoutAndExercises(req.params.id, (err, workout) => {
    if (err) throw err;

    res.render('workoutDetail', {workout: workout[0], exercises: workout[0].exercises, sets: workout[0].sets});
  });
});

// GET request to display interface for logging a freeform workout
router.get('/log', (req, res) => {
  if (req.user) {
    Exercise.getOwnExercises(req.user, (err, exercises) => {
      res.render('log', {exercises: exercises});
    });

  } else {
    res.redirect('/');
  }
});

// GET request to display interface for logging a specific workout
router.get('/log/:id', (req, res) => {
  if (req.user) {
    res.render('log');

  } else {
    res.redirect('/');
  }
});

// POST request upon workout completion
// this is completely awful and needs refactored
router.post('/complete', (req, res) => {
  /* NEEDS TO
      - Create a new workout
      - Add new workout to the User
      - Move Sets from every Exercise in the Workout to each Exercise's history
      - Add same Sets to the Workout 'sets'
  */
  if (req.user) {


    req.flash('success', 'Workout completed!');
    res.redirect('/user');

  } else {
    res.redirect('/');
  }
});

// POST request to delete a workout
router.post('/delete/:id', (req, res) => {
  Workout.getWorkoutByWorkoutId(req.params.id, (err, workout) => {
    if (err) throw err;

    workout.remove((err, result) => {
      if (err) throw err;

      res.redirect('/user');
    });
  })
});

module.exports = router;
