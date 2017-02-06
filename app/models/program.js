'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Exercise = require('./exercise.js');

// define Program model
var ProgramModel = mongoose.Schema({
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

var Program = module.exports = mongoose.model('Program', ProgramModel);

// Program methods

// Program method - saves a program to the database
module.exports.createProgram = function(newProgram, cb) {
  newProgram.save(cb);
}

// Program method - updates a program
module.exports.updateProgram = function(program, cb) {
  Program.update({
    id: program._id
  }, program, cb);
}

// Program method - deletes a program
module.exports.deleteProgram = function(program, cb) {
  Program.findOneAndRemove({
    id: program._id
  }, cb);
}

// Program method - returns all programs
module.exports.getPrograms = function(cb) {
  Program.find({}, cb);
}

// Program method - returns all of users own programs
module.exports.getOwnPrograms = function(user, cb) {
  Program.find({
    creator: user._id
  }, cb);
}

// Program method - returns a single program, by ID
module.exports.getProgramByProgramId = function(programId, cb) {
  Program.findById(programId, cb);
}
