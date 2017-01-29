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

// GET request to display page where User can create a workout
router.get('/new', (req, res) => {
  if (req.user) {
    Workout.getOwnWorkouts(req.user, (err, workouts) => {
      Exercise.getOwnExercises(req.user, (err, exercises) => {
        res.render('createWorkout', {workouts: workouts, exercises: exercises});
      });
    });

  } else {
    res.redirect('/');
  }
});

// POST request to creating a new workout
router.post('/new', (req, res) => {
  // validate
  req.checkBody('name', 'Please enter a name').notEmpty();

  // handle errors or proceed
  if (req.validationErrors()) {
    // send validation errors
    req.getValidationResult().then((validationResult) => {
      res.json(validationResult.array());
    });

  } else {
    // create a workout and save to database
    let newWorkout = new Workout({
      name: req.body.name,
      description: req.body.description,
      creator: req.user._id,
    });

    // add exercises to workout
    let exercisePlaceholders = req.body.exercise;
    exercisePlaceholders.forEach(exerciseIdString => {
      for (let i = 0; i < req.user.exercises.length; i++) {
        if (String(req.user.exercises[i]) === exerciseIdString) {
          newWorkout.exercises.push(req.user.exercises[i]);
        }
      }
    });

    // add workout to user
    console.log('Adding workout to user, components: ')
    console.log(req.user)
    console.log(newWorkout)
    User.addWorkout(req.user, newWorkout, (err, result) => {
      if (err) throw err;
      console.log(result);
    });

    // add workout to exercises
    

    // save workout
    Workout.createWorkout(newWorkout, (err, result) => {
      if (err) throw err;
      console.log(result);
    })

    console.log(newWorkout);
    console.log(req.user);

    res.redirect('/user');
  }
});

// PUT request to update a workout
router.put('/edit', (req, res) => {

});

// DELETE request to delete a workout
router.delete('/delete', (req, res) => {

});

module.exports = router;
