'use strict';
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Exercise = require('../models/exercise.js');
const Program = require('../models/program.js');
const Workout = require('../models/workout.js');

// ensure a secure protocol
module.exports.forceHTTPS = function forceHTTPS(req, res, next) {
  if(req.headers["x-forwarded-proto"] === "https") {
    return next();

  } else {
    res.redirect(`https://${req.hostname}${req.url}`);
  }
}

module.exports.userHasResource = function userHasResource(user, resource) {
  return new Promise((resolve, reject) => {
    if (user === undefined) {
      resolve(false);
    }

    user.exercises.forEach((exercise) => {
      if (exercise == resource) {
        resolve(true);
      }
    });

    user.workouts.forEach((workout) => {
      if (workout == resource) {
        resolve(true);
      }
    });

    user.programs.forEach((program) => {
      if (program == resource) {
        resolve(true);
      }
    });

    resolve(false);
  });
}

module.exports.getPerformedSets = function getPerformedSets(user) {
  return new Promise((resolve, reject) => {
    let doneCount = 0;
    let performedSets = [];
    console.log(`querying for User and populated Exercises`)
    console.log(user)
    User.getUserAndExercises(user, (err, theUser) => {
      console.log(`got User`)
      console.log(theUser[0])
      console.log(`iteration over the user's exercises`)
      console.log(theUser[0].exercises)
      console.log(typeof theUser[0].exercises)
      theUser[0].exercises.forEach(exercise => {
        console.log(`got ${exercise} from user exercises`)
        console.log(exercise)
        console.log(`does this has sets? ${exercise.sets}, ${exercise.sets.length}`)
        // if true, the exercise was performed
        if (exercise.sets.length > 0) {
          console.log(`exercise '${exercise}' had sets, add to array`)
          performedSets.push(exercise.sets);
          console.log(`${performedSets}`)
          doneCount++;
          console.log(`doneCount v total: ${doneCount}, ${user.exercises.length}`);
          if (doneCount === user.exercises.length) {
            console.log(`resolve promise with ${performedSets}`)
            resolve(performedSets);
          }

        } else {
          console.log(`exercise ${exercise} had no sets, increase count anyway`)
          doneCount++;
          console.log(`doneCount v total: ${doneCount}, ${user.exercises.length}`);
          if (doneCount === user.exercises.length) {
            console.log(`resolve promise with ${performedSets}`)
            resolve(performedSets);
          }
        }

      });
    });
  });
}

module.exports.getPerformedExercises = function getPerformedExercises(user) {
  return new Promise((resolve, reject) => {
    let doneCount = 0;
    let performedExercises = [];

    User.getUserAndExercises(user, (err, theUser) => {
      theUser[0].exercises.forEach(exercise => {
        // if true, the exercise was performed
        if (exercise.sets.length > 0) {
          performedExercises.push(exercise);
          doneCount++;
          if (doneCount === theUser[0].exercises.length) {
            resolve(performedExercises);
          }

        } else {
          doneCount++;
          if (doneCount === theUser[0].exercises.length) {
            resolve(performedExercises);
          }
        }

      });
    });
  });
}

module.exports.updateTempModelSets = function updateTempModel(oTemp, performedSets) {
  return new Promise((resolve, reject) => {
    let doneNum = 0;
    let doneCount = 0;

    performedSets.forEach(setArray => {
      doneNum = setArray.length;

      setArray.forEach(set => {
        oTemp.sets.push(set);
        doneCount++;

        if (doneCount === doneNum) {
          resolve(oTemp);
        }
      });
    });
  });
}

module.exports.updateTempModelExercises = function updateTempModelExercises(oTemp, performedExercises) {
  return new Promise((resolve, reject) => {

    let doneNum = performedExercises.length;
    let doneCount = 0;

    performedExercises.forEach(exercise => {
      oTemp.exercises.push(exercise);
      doneCount++;

      if (doneCount === doneNum) {
        resolve(oTemp);
      }
    });
  });
}
