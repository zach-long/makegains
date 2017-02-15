var jsonExercises = [{"_id":"58a0ca0ba941c61fc52aa394","name":"Bench Press","description":"Push a barbell up while laying down in a supine position.","category":"Chest","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[{"date":"2017-02-12T20:49:26.320Z","_id":"58a0ca56a941c61fc52aa3a2","dataHistory":[{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a5"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a4"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a3"}]}],"sets":[]},{"_id":"58a0ca21a941c61fc52aa395","name":"Inline Bench Press","description":"Push a bar up while layout on your back on an incline bench.","category":"Chest","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[{"date":"2017-02-12T20:49:26.331Z","_id":"58a0ca56a941c61fc52aa3aa","dataHistory":[{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ae"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ad"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ac"},{"weight":105,"repetitions":11,"oneRepMax":143,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3ab"}]}],"sets":[]},{"_id":"58a0cd59229f5c20b00293f7","name":"Bicep Curl","description":"Best exercise","category":"Arms","creator":"58a0c9dba941c61fc52aa393","__v":0,"exerciseHistory":[],"sets":[]}];
var jsonWorkouts = [{"_id":"58a0ca56a941c61fc52aa39e","date":"2017-02-12T20:49:26.305Z","creator":"58a0c9dba941c61fc52aa393","__v":0,"sets":[{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa39f"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a0"},{"weight":135,"repetitions":10,"oneRepMax":180,"exercise":"Bench Press","_id":"58a0ca56a941c61fc52aa3a1"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a6"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a7"},{"weight":100,"repetitions":12,"oneRepMax":142,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a8"},{"weight":105,"repetitions":11,"oneRepMax":143,"exercise":"Inline Bench Press","_id":"58a0ca56a941c61fc52aa3a9"}],"exercises":["58a0ca0ba941c61fc52aa394","58a0ca21a941c61fc52aa395"]}];
var jsonPrograms = [{"_id":"58a0ca32a941c61fc52aa396","name":"Chest Workout","description":"Works your chest.","creator":"58a0c9dba941c61fc52aa393","__v":0,"exercises":["58a0ca0ba941c61fc52aa394","58a0ca21a941c61fc52aa395"]}];

// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function _DEV_getUserAssets(data, delimeter, type) {
  let reqType = type;

  _DEV_handleSpecificResponseType(data, reqType)
  .then(identifiedData => {
    _DEV_displayResponse(identifiedData.data, identifiedData.type);

  }, err => {
    console.log('Error in function "handleSpecficResponseType()"');
  });
}

// determines whether the response was an exercise or a program or a workout
// then assigns a type to it for further processing
function _DEV_handleSpecificResponseType(json, reqType) {
  return new Promise((resolve, reject) => {

    // check if data exists by sampling json data
    let sample = json[0];

    // initialize empty response object
    let response = {};

    // call function to display data based on type
    switch (reqType) {
      case 'exercises':
        response.type = 'exercises';
        console.log(`Type assigned: ${response.type}`);
        break;

      case 'workouts':
        response.type = 'workouts';
        console.log(`Type assigned: ${response.type}`);
        break;

      case 'programs':
        response.type = 'programs';
        console.log(`Type assigned: ${response.type}`);
        break;
    }

    // determined whether data is existant
    console.log('Assigning response.data')
    console.log('current value: ' + sample);
    console.log('value undefined? ' + sample === undefined)
    console.log('loose test: ' + sample == undefined)
    if (sample === undefined) {
      response.data = undefined;
      console.log(`Assigned data: ${response.data}`);
    } else {
      response.data = json;
      console.log(`Assigned data: ${response.data}`);
    }

    console.log('Resolving promise with object: ')
    console.log(response);
    resolve(response);
  });
}

// writes the reponse to the DOM based on what type of data is received
function _DEV_displayResponse(response, typeOfData) {
  // Hide the loading animation
  let loadingFields = document.getElementsByClassName('loading');
  for (let i = 0; i < loadingFields.length; i++) {
    loadingFields[i].classList.add('hidden');
  }

  // initialize HTML which is a part of every DOM addition
  let appendTo;
  let ul = document.createElement('ul');
  ul.classList.add('list-group');

  console.log('parsing response')
  console.log(response)
  console.log(typeOfData)
  console.log(response != undefined)
  console.log(response !== undefined)
  console.log(response == undefined)
  console.log(response === undefined)

  // create HTML for every json object, concatenate
  if (typeOfData == 'exercises' && response !== undefined) {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = _DEV_displayExercise(response);

  } else if (typeOfData == 'workouts' && response !== undefined) {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = _DEV_displayWorkout(response);

  } else if (typeOfData == 'programs' && response !== undefined) {
    appendTo = document.getElementById('programs');
    ul.innerHTML = _DEV_displayProgram(response);

  // displays the HTML for when no data is present
  } else if (typeOfData == 'exercises' && response === undefined) {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = _DEV_displayNodataExercise();

  } else if (typeOfData == 'workouts' && response === undefined) {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = _DEV_displayNodataWorkout();

  } else if (typeOfData == 'programs' && response === undefined) {
    appendTo = document.getElementById('programs');
    ul.innerHTML = _DEV_displayNodataProgram();

  // Something bad happened
  } else {
    alert(":(");
  }

  // Apply result to the DOM
  appendTo.appendChild(ul);
}

// functions to perform display operations based on datatype
function _DEV_displayExercise(response) {
  return response.map(exercise => {
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
}

function _DEV_displayWorkout(response) {
  return response.map(workout => {
    let localDate = new Date(workout.date).toLocaleString();
    return `<li class="list-group-item">
              <a href="/workout/detail/${workout._id}">${localDate}</a>
              <form method="post" action="/workout/delete/${workout._id}">
                <button class="btn btn-danger" type="submit">Delete</button>
              </form>
            </li>`
  }).join('');
}

function _DEV_displayProgram(response) {
  return response.map(program => {
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
}

function _DEV_displayNodataExercise() {
  return `<li class="list-group-item text-center">
            Add exercises to your account so you can add them to programs, log them in your workouts, and track your progress!
          </li>`;
}

function _DEV_displayNodataWorkout() {
  return `<li class="list-group-item text-center">
            You don't have any workouts logged yet! Add exercises so you can include them in logged workouts. Workouts can be free-form or follow a pre-defined program. Track your workouts so can start recording progress!
          </li>`;
}

function _DEV_displayNodataProgram() {
  return `<li class="list-group-item text-center">
            Have a few workouts that are "set-in-stone"? Input a your workout program so you can use it as a template while logging sets!
          </li>`;
}

// simulate loading
setTimeout(function() {
  _DEV_getUserAssets(jsonExercises, null, 'exercises');
  _DEV_getUserAssets(jsonWorkouts, null, 'workouts');
  _DEV_getUserAssets(jsonPrograms, null, 'programs');
}, 500);
