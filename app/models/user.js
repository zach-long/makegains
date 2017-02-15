'use strict';

// modules
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// import models
const Program = require('./program.js');
const Exercise = require('./exercise.js');
const Workout = require('./workout.js');

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
  programs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program'
  }],
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  workouts: [{
    type: mongoose.Schema. Types.ObjectId,
    ref: 'Workout'
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

// User method - adds a program to the the user
// ***** this may ultimately be unnecessary
module.exports.addProgram = function(programCreator, newProgram, cb) {
  programCreator.programs.push(newProgram);
  User.update({
    _id: programCreator._id
  },
  {
    $set: {
      programs: programCreator.programs
    }
  }, cb);
}

module.exports.addWorkout = function(user, newWorkout, cb) {
  user.workouts.push(newWorkout);
  User.update({
    _id: user._id
  },
  {
    $set: {
      workouts: user.workouts
    }
  }, cb)
}

// User method - adds a program to the the user
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

// User method - returns all programs belonging to a user
module.exports.getPrograms = function(programCreator, cb) {
  Program.find({creator: programCreator._id}, cb);
}

// User method - returns all exercises belonging to a user
module.exports.getExercises = function(exerciseCreator, category, cb) {
  if (category !== null) {
    Exercise.find({
      creator: exerciseCreator._id,
      category: category
    }, cb);
  } else {
    Exercise.find({
      creator: exerciseCreator._id
    }, cb);
  }
}

// User method - returns all exercises belonging to a user
module.exports.getWorkouts = function(workoutCreator, lowVal, highVal, cb) {
  if (timePeriod !== null) {
    Workout.find({
      creator: workoutCreator._id,
      date: {
        $gt: lowVal,
        $lt: highVal
      }
    }, cb);
  } else {
    Workout.find({
      creator: workoutCreator._id
    }, cb);
  }
}

// User method - returns all exercises belonging to a user
module.exports.getPrograms = function(programCreator, category, cb) {
  if (category !== null) {
    Program.find({
      creator: programCreator._id,
      category: category
    }, cb);
  } else {
    Program.find({
      creator: programCreator._id
    }, cb);
  }
}
