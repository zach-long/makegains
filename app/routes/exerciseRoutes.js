'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import models
const User = require('../models/user.js');
const Exercise = require('../models/exercise.js');
const Workout = require('../models/workout.js');

// GET request to return all of a users exercises
router.get('/myexercises', (req, res) => {
  Exercise.getOwnExercises(req.user, (err, exercises) => {
    if (err) throw err
    res.json(exercises);
  });
});

// GET request to display page where User can create an exercise
router.get('/new', (req, res) => {
  if (req.user) {
    Exercise.getOwnExercises(req.user, (err, exercises) => {
      res.render('createExercise', {exercises: exercises});
    });

  } else {
    res.redirect('/');
  }
});

// GET request to display specific information about an exercise
router.get('/detail/:id', (req, res) => {
  if (req.user) {
    let exerciseId = req.params.id;
    Exercise.getExerciseByExerciseId(exerciseId, (err, exercise) => {
      if (err) throw err;
      res.render('exerciseDetail', {exercise: exercise});
    });

  } else {
    res.redirect('/');
  }
});

// POST request to add set info to an exercise
router.post('/set/add', (req, res) => {
  // get the exercise
  Exercise.getExerciseByExerciseId(req.body.exercise, (err, exercise) => {
    // define the new set
    let newSet = {
      weight: req.body.weight,
      repetitions: req.body.reps,
    }

    // add set to exercise.sets array
    exercise.sets.push(newSet);

    // update exercise
    Exercise.addSet(exercise, (err, result) => {
      if (err) throw err;
      console.log(result);

      res.redirect('/workout/log');
    });
  });
});

// POST request to creating a new exercise
router.post('/new', (req, res) => {
  if (req.user) {
    // validate
    req.checkBody('name', 'Please enter a name').notEmpty();
    console.log('Console will track exercise creation process...');
    console.log('Validating new exercise...');

    // handle errors or proceed
    if (req.validationErrors()) {
      console.log('There were validation errors: ');
      // send validation errors
      req.getValidationResult().then((validationResult) => {
        console.log(validationResult);
        res.json(validationResult.array());
      });

    } else {
      console.log('New exercise validated successfully');
      // create an exercise and save to database
      let newExercise = new Exercise({
        name: req.body.name,
        description: req.body.description,
        creator: req.user
      });
      console.log(newExercise);

      Exercise.createExercise(newExercise, (err, theExercise) => {
        if (err) throw err;
        console.log('Saved exercise to DB successfully');
        console.log(theExercise);

        // Update User with this exercise
        User.addExercise(req.user, theExercise, (err, updatedUser) => {
          if (err) throw err;
          console.log('Added exercise to User who created it...');
          console.log(updatedUser);

          req.flash('success', 'Exercise created successfully!');
          console.log('All processes complete, changed entities printed below. New exercise should have a creator and the User should have this exercise.');
          console.log('Below: the Exercise -');
          console.log(theExercise);
          console.log(theExercise.creator);
          console.log('Below: the User - ');
          console.log(updatedUser);
          res.redirect('/user');
        });
      });
    }

  } else {
    res.json('You must be logged in to create exercises.');
  };
});

// PUT request to update a exercise
router.put('/edit', (req, res) => {

});

// DELETE request to delete a exercise
router.delete('/delete', (req, res) => {

});

module.exports = router;
