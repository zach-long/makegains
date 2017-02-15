'use strict';

// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function getUserAssets(url, delimeter) {
  var path = void 0;

  if (delimeter !== null) {
    path = url + '/' + delimeter;
  } else {
    path = url;
  }

  // define type of request
  var tempArray = url.split('/');
  var reqType = tempArray.pop();
  console.log(reqType);

  // flow of logic
  get(path).then(function (response) {
    var data = JSON.parse(response);

    handleSpecificResponseType(data, reqType).then(function (identifiedData) {
      displayResponse(identifiedData.data, identifiedData.type);
    }, function (err) {
      console.log('Error in function "handleSpecficResponseType()"');
    });
  }, function (err) {
    console.log('Error retrieving data in "getUserAssets()"');
  });
}

// determines whether the response was an exercise or a program or a workout
// then assigns a type to it for further processing
function handleSpecificResponseType(json, reqType) {
  return new Promise(function (resolve, reject) {

    // check if data exists by sampling json data
    var sample = json[0];

    // initialize empty response object
    var response = {};

    // call function to display data based on type
    switch (reqType) {
      case 'exercises':
        response.type = 'exercises';
        break;

      case 'workouts':
        response.type = 'workouts';
        break;

      case 'programs':
        response.type = 'programs';
        break;
    }

    // determined whether data is existant
    if (sample === undefined) {
      response.data === undefined;
    } else {
      response.data === json;
    }

    resolve(response);
  });
}

// writes the reponse to the DOM based on what type of data is received
function displayResponse(response, typeOfData) {
  // Hide the loading animation
  var loadingFields = document.getElementsByClassName('loading');
  for (var i = 0; i < loadingFields.length; i++) {
    loadingFields[i].classList.add('hidden');
  }

  // initialize HTML which is a part of every DOM addition
  var appendTo = void 0;
  var ul = document.createElement('ul');
  ul.classList.add('list-group');

  // create HTML for every json object, concatenate
  if (typeOfData == 'exercises' && response !== undefined) {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = displayExercise(response);
  } else if (typeOfData == 'workouts' && response !== undefined) {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = displayWorkout(response);
  } else if (typeOfData == 'programs' && response !== undefined) {
    appendTo = document.getElementById('programs');
    ul.innerHTML = displayProgram(response);

    // displays the HTML for when no data is present
  } else if (typeOfData == 'exercises' && response === undefined) {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = displayNodataExercise();
  } else if (typeOfData == 'workouts' && response === undefined) {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = displayNodataWorkout();
  } else if (typeOfData == 'programs' && response === undefined) {
    appendTo = document.getElementById('program');
    ul.innerHTML = displayNodataProgram();

    // Something bad happened
  } else {
    alert(":(");
  }

  // Apply result to the DOM
  appendTo.appendChild(ul);
}

// functions to perform display operations based on datatype
function displayExercise(response) {
  response.map(function (exercise) {
    return '<li class="list-group-item">\n              <a href="/exercise/detail/' + exercise._id + '">' + exercise.name + '</a>\n              <form method="post" action="/exercise/delete/' + exercise._id + '">\n                <button class="btn btn-danger" type="submit">Delete</button>\n              </form>\n              <form method="get" action="/exercise/edit/' + exercise._id + '">\n                <button class="btn btn-warning right-buffer" type="submit">Edit</button>\n              </form>\n            </li>';
  }).join('');
}

function displayWorkout(response) {
  response.map(function (workout) {
    var localDate = new Date(workout.date).toLocaleString();
    return '<li class="list-group-item">\n              <a href="/workout/detail/' + workout._id + '">' + localDate + '</a>\n              <form method="post" action="/workout/delete/' + workout._id + '">\n                <button class="btn btn-danger" type="submit">Delete</button>\n              </form>\n            </li>';
  }).join('');
}

function displayProgram(response) {
  response.map(function (program) {
    return '<li class="list-group-item">\n              <a href="/program/detail/' + program._id + '">' + program.name + '</a>\n              <!--\n              <form method="get" action="/program/edit/' + program._id + '">\n                <button class="btn btn-warning" type="submit">Edit</button>\n              </form>\n              <form method="post" action="/program/delete/' + program._id + '">\n                <button class="btn btn-danger" type="submit">Delete</button>\n              </form>\n              -->\n            </li>';
  }).join('');
}

function displayNodataExercise() {
  return '<li class="list-group-item text-center">\n            Add exercises to your account so you can add them to programs, log them in your workouts, and track your progress!\n          </li>';
}

function displayNodataWorkout() {
  return '<li class="list-group-item text-center">\n            You don\'t have any workouts logged yet! Add exercises so you can include them in logged workouts. Workouts can be free-form or follow a pre-defined program. Track your workouts so can start recording progress!\n          </li>';
}

function displayNodataProgram() {
  return '<li class="list-group-item text-center">\n            Have a few workouts that are "set-in-stone"? Input a your workout program so you can use it as a template while logging sets!\n          </li>';
}

// GET initial data from the server
getUserAssets('http://makegains.herokuapp.com/user/exercises', null);
getUserAssets('http://makegains.herokuapp.com/user/programs', null);
getUserAssets('http://makegains.herokuapp.com/user/workouts', null);
