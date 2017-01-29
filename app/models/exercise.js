'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Workout = require('./workout.js');

// define Set sub-schema
var ExerciseSet = mongoose.Schema({
  weight: Number,
  repetitions: Number,
  oneRepMax: Number
});

// define Exercise model
var ExerciseModel = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  sets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExerciseSet'
  }],
  history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExerciseSet'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }]
});

var Exercise = module.exports = mongoose.model('Exercise', ExerciseModel);

// Exercise methods

// Exercise method - saves a exercise to the database
module.exports.createExercise = function(newExercise, cb) {
  console.log('Inside ExerciseModel middleware...');
  console.log('MW - saved exercise:');
  console.log(newExercise);
  newExercise.save(cb);
}

// Exercise method - updates a exercise
module.exports.updateExercise = function(exercise, cb) {
  Exercise.update({
    id: exercise._id
  }, exercise, cb);
}

// Exercise method - assign all exercises of a workout the object reference of workout
module.exports.addWorkout = function(theExercise, workout) {
  console.log(theExercise)
  Exercise.findOne({ _id: theExercise }, (err, exercise) => {
    console.log(exercise)
    exercise.workouts.push(workout);
    Exercise.update({
      _id: exercise._id
    },
    {
      $set: {
        workouts: exercise.workouts
      }
    });
  })
}

// Exercise method - deletes a exercise
module.exports.deleteExercise = function(exercise, cb) {
  Exercise.findOneAndRemove({
    id: exercise._id
  }, cb);
}

// Exercise method - returns all exercises
module.exports.getExercises = function(cb) {
  Exercise.find({}, cb);
}

// Exercise method - returns all of users own exercises
module.exports.getOwnExercises = function(user, cb) {
  Exercise.find({
    creator: user._id
  }, cb);
}

// Exercise method - returns a single exercise, by ID
module.exports.getExerciseByExerciseId = function(exerciseId, cb) {
  Exercise.findById(Number(exerciseId), cb)
}

// Exercise method - returns a single exercise, by name
module.exports.getExerciseByExerciseName = function(exerciseName, cb) {
  Exercise.find({
    name: exerciseName
  }, cb);
}

// Exercise method - returns a single exercise, by name and ID
module.exports.sortExercises = function(exercisesNameArray, usersExercises, workout, cb) {
  for (let i = 0; i < exercisesNameArray.length; i++) {
    for (let j = 0; j < usersExercises.length; j++) {
      console.log("comparing " + exercisesNameArray[i] + " to " + usersExercises[j].name);
      if (exercisesNameArray[i] === usersExercises[j].name) {
        console.log(exercisesNameArray[i] + " matched " + usersExercises[j].name)
        workout.exercises.push(usersExercises[j]._id);
      }
    }
  }
  cb(null, workout);
}
