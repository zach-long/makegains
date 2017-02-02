'use strict';

// modules
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// import models
const Workout = require('./workout.js');
const Exercise = require('./exercise.js');

// define User model
var UserModel = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  workouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }],
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
});

// set User equal to a reference of the UserModel mongoose schema
var User = module.exports = mongoose.model('User', UserModel);

// User methods

// User method - hash user's password and save user to database
module.exports.createUser = function(newUser, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(cb);
    });
  });
}

// User method - updates a user in the database
module.exports.updateUser = function(user, cb) {
  User.update({
    id: user._id
  }, user, cb);
}

// User method - deletes a user from the database
module.exports.deleteUser = function(user, cb) {
  User.findOneAndRemove({
    id: user._id
  }, cb);
}

// User method - returns all users
module.exports.getUsers = function(cb) {
  User.find({}, cb);
}

// User method - returns a user with the provided username
module.exports.getUserByUsername = function(username, cb) {
  User.findOne({username: username}, cb);
}

// User method - returns a user with the provided id
module.exports.getUserById = function(userid, cb) {
  User.findById(userid, cb);
}

// User method - used to authenticate,
// checks if provided password matches what is in the database
module.exports.comparePassword = function(password, hash, cb) {
  bcrypt.compare(password, hash, (err, match) => {
    if (err) throw err
    cb(null, match);
  });
}

// User method - adds a workout to the the user
// ***** this may ultimately be unnecessary
module.exports.addWorkout = function(workoutCreator, newWorkout, cb) {
  workoutCreator.workouts.push(newWorkout);
  User.update({
    _id: workoutCreator._id
  },
  {
    $set: {
      workouts: workoutCreator.workouts
    }
  }, cb);
}

// User method - adds a workout to the the user
// ***** this may ultimately be unnecessary
module.exports.addExercise = function(exerciseCreator, newExercise, cb) {
  exerciseCreator.exercises.push(newExercise);
  User.update({
    _id: exerciseCreator._id
  },
  {
    $set: {
      exercises: exerciseCreator.exercises
    }
  }, cb);
}

module.exports.updateExercise = function(exerciseCreator, exerciseId, cb) {
  User.update({
    _id: exerciseCreator._id
  },
  {
    $set: {
      exercises: exerciseCreator.exercises
    }
  }, cb);
}

// User method - returns all workouts belonging to a user
module.exports.getWorkouts = function(workoutCreator, cb) {
  Workout.find({creator: workoutCreator._id}, cb);
}

// User method - returns all exercises belonging to a user
module.exports.getExercises = function(exerciseCreator, cb) {
  Exercise.find({creator: exerciseCreator._id}, cb);
}
