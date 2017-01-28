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

// POST request to creating a new workout
router.post('/new', (req, res) => {
  // validate
  req.checkBody('name', 'Please enter a name').notEmpty();
  req.checkBody('exercise', 'Workouts need exercises').notEmpty();

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
      creator: req.user
    });
    console.log('Setup new workout');
    console.log(newWorkout);
    //temp
    // find ObjectId of every exercise by name
    // push return exercises to newWorkout
    // THEN createWorkout
    //    In production this will be easier because I can
    //    display actual OIDs of Own exercises and have those be
    //    selected by User, no need for requery.
    newWorkout.exercises.push(req.body.exercise);

    Workout.createWorkout(newWorkout, (err, theWorkout) => {
      if (err) throw err

      // Update User with this workout
      User.addWorkout(req.user, theWorkout, (err, updatedUser) => {
        if (err) throw err;

        Exercise.updateAddedExercises(theWorkout, (err) => {
          if (err) throw err;

          res.json(theWorkout);
        });
      });
    });





    req.flash('success', 'Workout created successfully!');
    console.log(newWorkout);
    res.redirect('/');
  }
});

// PUT request to update a workout
router.put('/edit', (req, res) => {

});

// DELETE request to delete a workout
router.delete('/delete', (req, res) => {

});

module.exports = router;
