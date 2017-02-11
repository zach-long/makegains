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
  if (req.user) {
    let tempWorkout = new Workout({
      name: req.body.workoutName,
      date: new Date(),
      creator: req.user._id,
      exercises: [],
      sets: []
    });

    Workout.createWorkout(tempWorkout, (err, workout) => {
      if (err) throw err;

      // add workout to user
      User.addWorkout(req.user, tempWorkout, (err, user) => {
        if (err) throw err;

        // This is terribad
        // should be non-blocking and asynchronous, also less tangled
        for (let i = 0; i < req.user.exercises.length; i++) {
          Exercise.getExerciseByExerciseId(req.user.exercises[i], (err, exercise) => {

            let newHistory = {
              date: new Date(),
              dataHistory: []
            }

            if (exercise.sets.length > 0) {
              workout.exercises.push(exercise);
              Workout.addExercise(workout, (err, result) => {
                if (err) throw err;
              });
              console.log(exercise.sets)
              exercise.sets.forEach(entry => {
                let placeholder = {
                  weight: entry.weight,
                  repetitions: entry.repetitions,
                  oneRepMax: entry.oneRepMax,
                  exercise: entry.exercise
                }
                newHistory.dataHistory.push(placeholder);
                workout.sets.push(placeholder);
              });

              Workout.addSets(workout, (err, result) => {
                if (err) throw err;
              });

              exercise.exerciseHistory.push(newHistory);
              Exercise.updateHistory(exercise, (err, result) => {
                if (err) throw err;
              });
              exercise.sets.length = 0;
              Exercise.resetSets(exercise, (err, result) => {
                if (err) throw err;
              });
            };
          });
        }
        req.flash('success', 'Workout completed!');
        res.redirect('/user');
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
