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
const userHasResource = require('../resources/helperFunctions.js').userHasResource;

// GET request to show the details of a logged workout
router.get('/detail/:id', (req, res) => {
  userHasResource(req.user, req.params.id).then((bool) => {
    if (bool) {
      Workout.getWorkoutAndExercises(req.params.id, (err, workout) => {
        if (err) throw err;

        res.render('workoutDetail', {workout: workout[0], exercises: workout[0].exercises, sets: workout[0].sets});
      });

    } else {
      res.redirect('/');
    }
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
      console.log(`phase 1: got performed sets`)
      console.log(`${performedSets}`);
      updateTempModelSets(tempWorkout, performedSets)
      .then(updatedTempWorkout => {
        console.log(`phase 2: updated the Temp workout model`)
        console.log(`${updatedTempWorkout}`);
        getPerformedExercises(req.user)
        .then(performedExercises => {
          console.log(`phase 3: got performed exercises`)
          console.log(`${performedExercises}`);
          updateTempModelExercises(updatedTempWorkout, performedExercises)
          .then(newUpdatedTempWorkout => {
            console.log(`phase 4: updated the workout model`)
            console.log(`${newUpdatedTempWorkout}`);
            Exercise.archiveSets(performedExercises, (err, result) => {
              if (err) throw err;
              console.log(`Archived sets`)
              Workout.createWorkout(newUpdatedTempWorkout, (err, result) => {
                if (err) throw err;
                console.log(`Created the workout`)
                req.flash('success', 'Workout completed!');
                res.redirect('/user')
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
  userHasResource(req.user, req.params.id).then((bool) => {
    if (bool) {

      Workout.getWorkoutByWorkoutId(req.params.id, (err, workout) => {
        if (err) throw err;

        workout.remove((err, result) => {
          if (err) throw err;

          res.redirect('/user');
        });
      });

    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
