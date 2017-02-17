'use strict';

// modules
const mongoose = require('mongoose');

// import models
const User = require('./user.js');
const Program = require('./program.js');

// define Set sub-schema
var ExerciseSetModel = mongoose.Schema({
  weight: Number,
  repetitions: Number,
  oneRepMax: Number,
  exercise: String
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
  category: {
    type: String
  },
  sets: [ExerciseSetModel],
  exerciseHistory: [ExerciseHistorySetModel],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// removes references from the User and Programs when an exercise is removed
ExerciseModel.post('remove', (next) => {
  mongoose.model('User').update({},
    { $pull: { exercises: this._id } },
    { "multi": true });
  mongoose.model('Program').update({},
    { $pull: { exercises: this._id } },
    { "multi": true });
  next;
});

// adds references to the User when an exercise is created
ExerciseModel.post('save', (next) => {
  mongoose.model('User').update({},
  { $push: { exercises: this._id } });
  next;
})

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

// Exercise method - assign all exercises of a program the object reference of program
module.exports.addProgram = function(exercise, program, cb) {
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      programs: exercise.programs
    }
  }, cb);
}

// Exercise method - deletes an exercise and removes references of it
module.exports.deleteExercise = function(exercise, cb) {
  exercise.remove(cb);
}

// Exercise method - returns all exercises
module.exports.getExercises = function(cb) {
  Exercise.find({}, cb);
}
module.exports.getExercisesPromise = function() {
  return new Promise((resolve, reject) => {
    let exercises = Exercise.find({name: 'Bench Press'});
    if (exercises) {
      resolve(exercises);
    } else {
      reject(Error());
    }
  })
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
module.exports.addSet = function(exercise, setToAdd, cb) {
  exercise.sets.push(setToAdd);
  Exercise.update({
    _id: exercise._id
  },
  {
    $set: {
      sets: exercise.sets
    }
  }, cb);
}

// Exercise method - removes the specified set from an exercise, and updates it
module.exports.removeSet = function(exercise, idToRemove, cb) {
  exercise.sets.forEach(set => {
    if (set._id == idToRemove) {
      exercise.sets.splice(exercise.sets.indexOf(set), 1);
    }
  });

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

// Exercise method - moves all data from Exercise.sets into Exercise.history
module.exports.archiveSets = function(performedExercises, cb) {
  console.log('Examining "archiveSets" middleware for bugs...')
  let doneCount = 0;
  console.log(`doneCount initialized: ${doneCount}`)
  console.log('iteration over exercises')
  performedExercises.forEach(exercise => {
    console.log(`examining exercise ${exercise.name}, below:`)
    console.log(exercise)
    Exercise.findById(exercise, (err, theExercise) => {
      console.log(`found exercise ${theExercise.name}, below:`)
      console.log(theExercise)
      if (err) throw err;

      console.log('initializing newHistory object')
      let newHistory = {
        date: new Date(),
        dataHistory: []
      }
      console.log(newHistory)

      console.log('entering actual "archive" method')
      archive(theExercise, newHistory, (newNewHistory) => {
        console.log('exiting "archive" method, here is the new history object')
        console.log(newNewHistory)
        console.log('apply history to exercise and remove sets')
        theExercise.exerciseHistory.push(newNewHistory);
        theExercise.sets.length = 0;
        console.log('the exercise history:')
        console.log(theExercise.exerciseHistory)
        console.log('the exercise sets')
        console.log(theExercise.sets)
        console.log('update modified exercise, below:')
        console.log(theExercise)
        Exercise.update({
          _id: theExercise._id
        },
        {
          $set: {
            exerciseHistory: theExercise.exerciseHistory,
            sets: theExercise.sets
          }
        }, (err, result) => {
          console.log('exercise updated, check done count')
          doneCount++;
          console.log(doneCount)
          console.log('Does doneCount match the goal?')
          console.log(`doneCount = ${doneCount}, goal = ${performedExercises.length}`)
          if (doneCount === performedExercises.length) {
            console.log('doneCount fulfilled, send callback')
            cb(null, 'All updated');
          }
        });
      });
    });
  });

  function archive(exercise, arrTemp, cb) {
    console.log('entered "archive" with following arguments:')
    console.log('the exercise: ')
    console.log(exercise)
    console.log('the temp')
    console.log(arrTemp)
    console.log('iterating over exercise sets...')
    exercise.sets.forEach(entry => {
      console.log('examining - ' + entry)
      console.log('initialized placeholder')
      let placeholder = {
        weight: entry.weight,
        repetitions: entry.repetitions,
        oneRepMax: entry.oneRepMax,
        exercise: entry.exercise
      }
      console.log(placeholder)
      console.log('pushing placeholder to the temp array')
      arrTemp.dataHistory.push(placeholder);
      console.log(arrTemp)
    });
    console.log('iteration complete, sending callback with temp arr:')
    console.log(arrTemp)
    cb(arrTemp);
  }

}
