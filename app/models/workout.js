'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Exercise = require('./exercise.js');
const Program = require('./program.js');

// define Set sub-schema
var ExerciseSetModel = mongoose.Schema({
  weight: Number,
  repetitions: Number,
  oneRepMax: Number,
  exercise: String
});

// define Workout model
var WorkoutModel = mongoose.Schema({
  name: {
    type: String
  },
  date: {
    type: Date
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  sets: [ExerciseSetModel]
});

// hook to remove deleted workout from User
WorkoutModel.pre('remove', (next) => {
  User.update({},
    { $pull: { workouts: this._id } },
    { "multi": true });
  next;
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

// Workout method - gets exercises for this workout
module.exports.getWorkoutAndExercises = function(workoutId, cb) {
  Workout.find({
    _id: workoutId
  }).populate('exercises').exec(cb);
}

module.exports.addExercise = function(workout, cb) {
  Workout.update({
    _id: workout._id
  },
  {
    $set: {
      exercises: workout.exercises
    }
  }, cb);
}

module.exports.addSets = function(workout, cb) {
  Workout.update({
    _id: workout._id
  },
  {
    $set: {
      sets: workout.sets
    }
  }, cb);
}

// Workout method - deletes a workout
module.exports.deleteWorkout = function(workout, cb) {
  workout.remove(cb);
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
module.exports.getWorkoutByWorkoutId = function(workoutId, cb) {
  Workout.findById(workoutId, cb);
}
