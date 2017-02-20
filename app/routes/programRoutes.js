'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// import models
const User = require('../models/user.js');
const Program = require('../models/program.js');
const Exercise = require('../models/exercise.js');

// import helper functions
const userHasResource = require('../resources/helperFunctions.js').userHasResource;

// GET request to return all of a users programs
router.get('/myprograms', (req, res) => {
  if (req.user) {
    Program.getOwnPrograms(req.user, (err, programs) => {
      if (err) throw err

      res.json(programs);
    });

  } else {
    res.json({ error: 'You must be logged in to view your programs.' });
  }
});

// GET request to display page where User can create a program
router.get('/new', (req, res) => {
  if (req.user) {
    Program.getOwnPrograms(req.user, (err, programs) => {
      Exercise.getOwnExercises(req.user, (err, exercises) => {
        res.render('createProgram', {programs: programs, exercises: exercises});
      });
    });

  } else {
    res.redirect('/');
  }
});

// GET request to display specific information about a program
router.get('/detail/:id', (req, res) => {
  if (req.user) {
    userHasResource(req.user, req.params.id).then((bool) => {
      if (bool) {

        let programId = req.params.id;
        Program.getProgramByProgramId(programId, (err, program) => {
          if (err) throw err;
          res.render('programDetail', {program: program});
        });

      } else {
        res.redirect('/user');
      }
    });
  } else {
    res.redirect('/');
  }
});

// GET request to display interface for logging a freeform program
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

// GET request to display interface for logging a specific program
router.get('/log/:id', (req, res) => {
  if (req.user) {
    res.render('log');

  } else {
    res.redirect('/');
  }
});

// POST request upon program completion
router.post('/complete', (req, res) => {
  if (req.user) {
    console.log("Completing program")
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
    req.flash('success', 'Program completed!');
    res.redirect('/user');

  } else {
    res.redirect('/');
  }
});

// POST request to creating a new program
router.post('/new', (req, res) => {
  // validate
  req.checkBody('name', 'Please enter a name').notEmpty();

  // handle errors or proceed
  if (req.validationErrors()) {
    // send validation errors
    req.getValidationResult().then((validationResult) => {
      let err = validationResult.array()[0].msg;
      req.flash('fail', err);
      res.redirect('/user');
    });

  } else {
    // create a program and save to database
    let newProgram = new Program({
      name: req.body.name,
      description: req.body.description,
      creator: req.user._id,
    });

    // add exercises to program
    let exercisePlaceholders = req.body.exercise;
    exercisePlaceholders.forEach(exerciseIdString => {
      for (let i = 0; i < req.user.exercises.length; i++) {
        if (String(req.user.exercises[i]) === exerciseIdString) {
          newProgram.exercises.push(req.user.exercises[i]);
        }
      }
    });

    // add program to user
    console.log('Adding program to user, components: ')
    console.log(req.user)
    console.log(newProgram)
    User.addProgram(req.user, newProgram, (err, result) => {
      if (err) throw err;
      console.log(result);
    });

    // add program to exercises


    // save program
    Program.createProgram(newProgram, (err, result) => {
      if (err) throw err;
      console.log(result);
    })

    console.log(newProgram);
    console.log(req.user);
    req.flash('success', 'Program created successfully!');
    res.redirect('/user');
  }
});

// PUT request to update a program
router.put('/edit/:id', (req, res) => {
  userHasResource(req.user, req.params.id).then((bool) => {
    if (bool) {


    } else {
      res.redirect('/');
    }
  });
});

// DELETE request to delete a program
router.delete('/delete/:id', (req, res) => {
  userHasResource(req.user, req.params.id).then((bool) => {
    if (bool) {


    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
