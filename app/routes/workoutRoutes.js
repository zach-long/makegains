'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import models
const User = require('../models/user.js');
const Workout = require('../models/workout.js');
const Exercise = require('../models/exercise.js');

// import helper functions
const getPerformedSets = require('../resources/helperFunctions.js').getPerformedSets;
const getPerformedExercises = require('../resources/helperFunctions.js').getPerformedExercises;
const updateTempModelSets = require('../resources/helperFunctions.js').updateTempModelSets;
const updateTempModelExercises = require('../resources/helperFunctions.js').updateTempModelExercises;

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
router.post('/complete', (req, res) => {
  if (req.user) {
    let tempWorkout = new Workout({
      name: req.body.workoutName,
      date: new Date(),
      creator: req.user._id,
      exercises: [],
      sets: []
    });

    getPerformedSets(req.user)
    .then(performedSets => {

      updateTempModelSets(tempWorkout, performedSets)
      .then(updatedTempWorkout => {

        getPerformedExercises(req.user)
        .then(performedExercises => {

          updateTempModelExercises(updatedTempWorkout, performedExercises)
          .then(newUpdatedTempWorkout => {

            Exercise.archiveSets(performedExercises, (err, result) => {
              if (err) throw err;

              Workout.createWorkout(newUpdatedTempWorkout, (err, result) => {
                if (err) throw err;

                User.addWorkout(req.user, newUpdatedTempWorkout, (err, result) => {
                  if (err) throw err;

                  req.flash('success', 'Workout completed!');
                  res.redirect('/user')
                });
              });
            });
          });
        });
      });
    });

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
