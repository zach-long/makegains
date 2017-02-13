var jsonExercises = [{"_id":"58a0ca0ba941c61fc52aa394","name":"Bench Press","description":"Push a barbell up while laying down in a supine position.","category":"Chest","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[{"date":"2017-02-12T20:49:26.320Z","_id":"58a0ca56a941c61fc52aa3a2","dataHistory":[{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a5"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a4"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a3"}]}],"sets":[]},{"_id":"58a0ca21a941c61fc52aa395","name":"Inline Bench Press","description":"Push a bar up while layout on your back on an incline bench.","category":"Chest","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[{"date":"2017-02-12T20:49:26.331Z","_id":"58a0ca56a941c61fc52aa3aa","dataHistory":[{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ae"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ad"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ac"},{"weight":105,"repetitions":11,"oneRepMax":143,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ab"}]}],"sets":[]},{"_id":"58a0cd59229f5c20b00293f7","name":"Bicep Curl","description":"Best exercise","category":"Arms","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[],"sets":[]}];
var jsonWorkouts = [{"_id":"58a0ca56a941c61fc52aa39e","date":"2017-02-12T20:49:26.305Z","creator":"58a0c9dba941c61fc52aa393","__v":0,"sets":[{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa39f"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a0"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a1"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a6"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a7"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a8"},{"weight":105,"repetitions":11,"oneRepMax":143,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a9"}],"exercises":["58a0ca0ba941c61fc52aa394","58a0ca21a941c61fc52aa395"]}];
var jsonPrograms = [{"_id":"58a0ca32a941c61fc52aa396","name":"Chest Workout","description":"Works your chest.","creator":"58a0c9dba941c61fc52aa393","__v":0,"exercises":["58a0ca0ba941c61fc52aa394","58a0ca21a941c61fc52aa395"]}];

// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function _DEV_getUserAssets(data, delimeter) {

  _DEV_handleSpecificResponseType(data)
  .then(identifiedData => {
    _DEV_displayResponse(identifiedData.data, identifiedData.type);

  }, err => {
    console.log(`Error in function "_DEV_handleSpecficResponseType()": ${err}`);
  });
}

// determines whether the response was an exercise or a program or a workout
// then assigns a type to it for further processing
function _DEV_handleSpecificResponseType(json) {
  return new Promise((resolve, reject) => {

    let sampleCase = json[0];
    let response = {};
    if (sampleCase === undefined) {
      response.data = 'You have no data for this yet!';
      response.type = 'none';
      resolve(response);
    } else if (_DEV_isExercise(sampleCase)) {
      response.data = json;
      response.type = 'exercise';
      resolve(response);

    } else if (_DEV_isWorkout(sampleCase)) {
      response.data = json;
      response.type = 'workout';
      resolve(response);

    } else if (_DEV_isProgram(sampleCase)) {
      response.data = json;
      response.type = 'program';
      resolve(response);

    } else {
      reject(Error('An error has occured, sorry this isn\'t more specific!'));
    }
  });
}

// writes the reponse to the DOM based on what type of data is received
function _DEV_displayResponse(response, typeOfData) {
  let loadingFields = document.getElementsByClassName('loading');
  for (let i = 0; i < loadingFields.length; i++) {
    loadingFields[i].classList.add('hidden');
  }

  let appendTo = undefined;
  let ul = document.createElement('ul');
  ul.classList.add('list-group');

  if (typeOfData == 'exercise') {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = response.map(exercise => {
      return `<li class="list-group-item">
                <a href="/exercise/detail/${exercise._id}">${exercise.name}</a>
                <form method="post" action="/exercise/delete/${exercise._id}">
                  <button class="btn btn-danger" type="submit">Delete</button>
                </form>
                <form method="get" action="/exercise/edit/${exercise._id}">
                  <button class="btn btn-warning right-buffer" type="submit">Edit</button>
                </form>
              </li>`
    }).join('');

  } else if (typeOfData == 'workout') {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = response.map(workout => {
      let localDate = new Date(workout.date).toLocaleString();
      return `<li class="list-group-item">
                <a href="/workout/detail/${workout._id}">${localDate}</a>
                <form method="post" action="/workout/delete/${workout._id}">
                  <button class="btn btn-danger" type="submit">Delete</button>
                </form>
              </li>`
    }).join('');

  } else if (typeOfData == 'program') {
    appendTo = document.getElementById('programs');
    ul.innerHTML = response.map(program => {
      return `<li class="list-group-item">
                <a href="/program/detail/${program._id}">${program.name}</a>
                <!--
                <form method="get" action="/program/edit/${program._id}">
                  <button class="btn btn-warning" type="submit">Edit</button>
                </form>
                <form method="post" action="/program/delete/${program._id}">
                  <button class="btn btn-danger" type="submit">Delete</button>
                </form>
                -->
              </li>`
    }).join('');

  } else if (typeOfData == 'none') {
    if (document.getElementById('exercises').innerHTML.length < 170) {
      appendTo = document.getElementById('exercises');
      ul.innerHTML = `<li class="list-group-item text-center">Add exercises to your account so you can add them to programs, log them in your workouts, and track your progress!</li>`;

    } else if (document.getElementById('workouts').innerHTML.length < 170) {
      appendTo = document.getElementById('workouts');
      ul.innerHTML = `<li class="list-group-item text-center">You don't have any workouts logged yet! Add exercises so you can include them in logged workouts. Workouts can be free-form or follow a pre-defined program. Track your workouts so can start recording progress!</li>`;

    } else {
      appendTo = document.getElementById('programs');
      ul.innerHTML = `<li class="list-group-item text-center">Have a few workouts that are "set-in-stone"? Input a your workout program so you can use it as a template while logging sets!</li>`;
    }
  } else {
    alert("list-group-item text-center");
  }
  appendTo.appendChild(ul);
}

// functions to check the type of the json response
function _DEV_isExercise(sample) {
  return sample.hasOwnProperty('exerciseHistory') ? true : false;
}
function _DEV_isWorkout(sample) {
  return sample.hasOwnProperty('date') ? true : false;
}
function _DEV_isProgram(sample) {
  if (!_DEV_isExercise(sample) && !_DEV_isWorkout(sample)) {
    return true;
  } else {
    return false;
  }
}

// simulate loading
setTimeout(function() {
  _DEV_getUserAssets(jsonExercises, null);
  _DEV_getUserAssets(jsonWorkouts, null);
  _DEV_getUserAssets(jsonPrograms, null);
}, 2000);
