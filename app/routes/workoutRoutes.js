'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import models
const User = require('../models/user.js');
const Workout = require('../models/workout.js');
const Exercise = require('../models/exercise.js');

// GET request to return all of a users workouts
router.get('/myworkouts', (req, res) => {
  Workout.getOwnWorkouts(req.user, (err, workouts) => {
    if (err) throw err
    res.json(workouts);
  });
});

// GET request to display interface for logging a freeform workout
router.get('/log', (req, res) => {
  if (req.user) {
    console.log(res.locals)
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
    console.log("Completing workout")
    console.log('looking at every exercise for ' + req.user.name)
    req.user.exercises.forEach(exercise => {
      console.log(exercise)
      Exercise.getExerciseByExerciseId(exercise, (err, exercise) => {
        console.log('found exercise:')
        console.log(exercise)
        let newHistory = {
          date: new Date(),
          dataHistory: []
        }
        console.log('looking at sets of ' + exercise.name)
        exercise.sets.forEach(entry => {
          console.log(entry)
          let placeholder = {
            weight: entry.weight,
            repetitions: entry.repetitions,
            oneRepMax: entry.oneRepMax
          }
          newHistory.dataHistory.push(placeholder);
        });
        exercise.exerciseHistory.push(newHistory);
        Exercise.updateHistory(exercise, (err, result) => {
          if (err) throw err;
          console.log(result);
        });
        exercise.sets.length = 0;
        Exercise.resetSets(exercise, (err, result) => {
          if (err) throw err;
          console.log(result);
        });
      });
    });
    req.flash('success', 'Workout completed!');
    res.redirect('/user');

  } else {
    res.redirect('/');
  }
});

// DELETE request to delete a workout
router.delete('/delete', (req, res) => {

});

module.exports = router;
