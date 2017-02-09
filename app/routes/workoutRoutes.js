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
    console.log('******************* the workout *******************')
    console.log(workout)
    console.log('******************* the exercises *******************')
    console.log(workout[0].exercises);
    console.log('******************* the history *******************')
    workout[0].exercises.forEach(eh => {
      eh.exerciseHistory.forEach(h => {
        console.log(h.dataHistory)
      })
    })

    res.render('workoutDetail', {workout: workout[0], exercises: workout[0].exercises});
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
// this is completely awful and needs refactored
router.post('/complete', (req, res) => {
  if (req.user) {
    let tempWorkout = new Workout({
      name: req.body.workoutName,
      date: new Date(),
      creator: req.user._id,
      exercises: []
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
              exercise.sets.forEach(entry => {
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

// DELETE request to delete a workout
router.delete('/delete', (req, res) => {

});

module.exports = router;
