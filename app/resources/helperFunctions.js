'use strict';
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

    user.exercises.forEach(exercise => {
      Exercise.getExerciseByExerciseId(exercise, (err, exercise) => {
        if (err) throw err;

        // if true, the exercise was performed
        if (exercise.sets.length > 0) {
          performedSets.push(exercise.sets);
          doneCount++;
          if (doneCount === user.exercises.length) {
            resolve(performedSets);
          }

        } else {
          doneCount++;
          if (doneCount === user.exercises.length) {
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

    user.exercises.forEach(exercise => {
      Exercise.getExerciseByExerciseId(exercise, (err, exercise) => {
        if (err) throw err;

        // if true, the exercise was performed
        if (exercise.sets.length > 0) {
          performedExercises.push(exercise);
          doneCount++;
          if (doneCount === user.exercises.length) {
            resolve(performedExercises);
          }

        } else {
          doneCount++;
          if (doneCount === user.exercises.length) {
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
