'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Workout = require('./workout.js');

// define Set sub-schema
var ExerciseSetModel = mongoose.Schema({
  weight: Number,
  repetitions: Number,
  oneRepMax: Number
});

var ExerciseHistorySetModel = mongoose.Schema({
  date: Date,
  dataHistory: [ExerciseSetModel]
});

// define Exercise model
var ExerciseModel = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  sets: [ExerciseSetModel],
  exerciseHistory: [ExerciseHistorySetModel],
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
  newExercise.save(cb);
}

// Exercise method - updates a exercise
// - used in generic Exercise edit request
module.exports.updateExercise = function(exercise, newParams, cb) {
  Exercise.update({
    _id: exercise._id
  },
  newParams, cb);
}

// Exercise method - updates the 'sets' of an exercise
// - used when deleting a set from an exercise
module.exports.updateSet = function(exercise, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      sets: exercise.sets
    }
  }, cb);
}

// Exercise method - assign all exercises of a workout the object reference of workout
module.exports.addWorkout = function(exercise, workout, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      workouts: exercise.workouts
    }
  }, cb);
}

// Exercise method - deletes a exercise
module.exports.deleteExercise = function(exerciseId, cb) {
  Exercise.findOneAndRemove({
    _id: exerciseId
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
  Exercise.findById(exerciseId, cb);
}

// Exercise method - gets specified exercise and updates the set information
module.exports.addSet = function(exercise, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      sets: exercise.sets
    }
  }, cb);
}

// Exercise method - moves all data from Exercise.sets into Exercise.history
module.exports.resetSets = function(exercise, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      sets: exercise.sets,
    }
  }, cb);
}

module.exports.updateHistory = function(exercise, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      exerciseHistory: exercise.exerciseHistory
    }
  }, cb);
}
