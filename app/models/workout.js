'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Exercise = require('./exercise.js');

// define Workout model
var WorkoutModel = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
});

var Workout = module.exports = mongoose.model('Workout', WorkoutModel);

// Workout methods

// Workout method - saves a workout to the database
module.exports.createWorkout = function(newWorkout, cb) {
  newWorkout.save(cb);
}

// Workout method - updates a workout
module.exports.updateWorkout = function(workout, cb) {
  Workout.update({
    id: workout._id
  }, workout, cb);
}

// Workout method - deletes a workout
module.exports.deleteWorkout = function(workout, cb) {
  Workout.findOneAndRemove({
    id: workout._id
  }, cb);
}

// Workout method - returns all workouts
module.exports.getWorkouts = function(cb) {
  Workout.find({}, cb);
}

// Workout method - returns all of users own workouts
module.exports.getOwnWorkouts = function(user, cb) {
  Workout.find({
    creator: user._id
  }, cb);
}

// Workout method - returns a single workout, by ID
module.exports.getWorkoutByWorkoutId = function(workout, cb) {
  Workout.find({
    id: workout._id
  }, cb);
}

// Workout method - returns a single workout, by name
module.exports.getWorkoutByWorkoutName = function(workoutName, cb) {
  Workout.find({
    name: workoutName
  }, cb);
}
