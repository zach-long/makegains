'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import one rep max calcuator
const calculateEstimatedOneRepMax = require('../resources/oneRepMax.js');

// import models
const User = require('../models/user.js');
const Exercise = require('../models/exercise.js');
const Program = require('../models/program.js');

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
    Exercise.getExerciseByExerciseId(req.params.id, (err, exercise) => {
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
    // calculate estimated one rep max
    let estMax = calculateEstimatedOneRepMax(req.body.weight, req.body.reps);

    // define the new set
    let newSet = {
      weight: req.body.weight,
      repetitions: req.body.reps,
      oneRepMax: estMax,
      exercise: exercise.name
    }

    // update exercise
    Exercise.addSet(exercise, newSet, (err, result) => {
      if (err) throw err;

      res.redirect('/program/log');
    });
  });
});

// POST request to creating a new exercise
router.post('/new', (req, res) => {
  if (req.user) {
    // validate
    req.checkBody('name', 'Please enter a name').notEmpty();

    // handle errors or proceed
    if (req.validationErrors()) {
      // send validation errors
      req.getValidationResult().then((validationResult) => {
        res.json(validationResult.array());
      });

    } else {
      // create an exercise and save to database
      let newExercise = new Exercise({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        creator: req.user
      });

      Exercise.createExercise(newExercise, (err, theExercise) => {
        if (err) throw err;

        // Update User with this exercise
        User.addExercise(req.user, theExercise, (err, updatedUser) => {
          if (err) throw err;

          req.flash('success', 'Exercise created successfully!');
          res.redirect('/user');
        });
      });
    }

  } else {
    res.json('You must be logged in to create exercises.');
  };
});

// POST request to delete a set from exercise.sets
router.post('/set/delete/:exerciseId/:setId', (req, res) => {
  // get the exercise to remove a set from
  Exercise.getExerciseByExerciseId(req.params.exerciseId, (err, exercise) => {

    // find the set requested for removal
    Exercise.removeSet(exercise, req.params.setId, (err, updatedExercise) => {
      if (err) throw err;

      req.flash('success', 'Set deleted');
      res.redirect('/program/log');
    });
  });
});

// GET request to update an exercise
router.get('/edit/:id', (req, res) => {
  Exercise.getExerciseByExerciseId(req.params.id, (err, exercise) => {
    if (err) throw err;

    res.render('editExercise', {exercise: exercise});
  });
});

// POST request to update an exercise
router.post('/edit/:id', (req, res) => {
  // define new exercise information
  let newParams = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category
  }

  // update the exercise with requested information
  Exercise.getExerciseByExerciseId(req.params.id, (err, exercise) => {
    if (err) throw err;

    Exercise.updateExercise(exercise, newParams, (err, result) => {
      if (err) throw err;

      req.flash('success', 'Exercise "' + exercise.name + '" updated!');
      res.redirect('/user');
    });
  });
});

// DELETE request to delete an exercise
router.post('/delete/:id', (req, res) => {
  Exercise.getExerciseByExerciseId(req.params.id, (err, exercise) => {
    if (err) throw err;

    let eName = exercise.name;
    Exercise.deleteExercise(exercise, (err, result) => {
      if (err) throw err;

      req.flash('success', `Exercise '${eName}' deleted successfully!`);
    });
  });
});

module.exports = router;
