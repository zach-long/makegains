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

// GET request for specific data used by AJAX
router.get('/detail/api/:id', (req, res) => {
  if (req.user) {
    let exerciseId = req.params.id;
    Exercise.getExerciseByExerciseId(exerciseId, (err, exercise) => {
      if (err) throw err;
      res.json(exercise);
    });

  } else {
    res.json('You are not authorized to access this resource.');
  }
});

// POST request to add set info to an exercise
router.post('/set/add', (req, res) => {
  // get the exercise
  Exercise.getExerciseByExerciseId(req.body.exercise, (err, exercise) => {
    // calculate estimated one rep max
    let estMax = calculateEstimatedOneRepMax(req.body.weight, req.body.reps);
    console.log(estMax);
    // define the new set
    let newSet = {
      weight: req.body.weight,
      repetitions: req.body.reps,
      oneRepMax: estMax
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

// POST request to delete a set from exercise.sets
router.post('/set/delete/:exerciseId/:setId', (req, res) => {
  // get the exercise to remove a set from
  Exercise.getExerciseByExerciseId(req.params.exerciseId, (err, exercise) => {
    // find the set requested for removal
    exercise.sets.forEach(set => {
      if (set._id == req.params.setId) {
        exercise.sets.splice(exercise.sets.indexOf(set), 1);
      }
    });
    // save the updated exercise
    Exercise.updateSet(exercise, (err, result) => {
      req.flash('success', 'Set deleted');
      res.redirect('/workout/log');
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
    description: req.body.description
  }
  // update the exercise with requested information
  Exercise.getExerciseByExerciseId(req.params.id, (err, exercise) => {
    Exercise.updateExercise(exercise, newParams, (err, result) => {
      req.flash('success', 'Exercise "' + exercise.name + '" updated!');
      res.redirect('/user');
    });
  });
});

// DELETE request to delete an exercise
router.post('/delete/:id', (req, res) => {
  Exercise.deleteExercise(req.params.id, (err, result) => {
    if (err) throw err;

    User.getUserById(req.user._id, (err, user) => {
      if (err) throw err;
      user.exercises.forEach(exercise => {
        console.log(exercise)
        console.log(req.params.id)
        if (exercise == req.params.id) {
          console.log('match')
          user.exercises.splice(user.exercises.indexOf(exercise), 1);
        }
      });

      User.updateExercise(user, req.params.id, (err, result) => {
        if (err) throw err;
        req.flash('success', 'Exercise deleted');
        res.redirect('/user');
      });
    });
  });
});

module.exports = router;
