(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _getUserAssets = require('./modules/getUserAssets.js');

var _exerciseData = require('./modules/exerciseData.js');

var _sort = require('./modules/sort.js');

var _helperFunctions = require('./modules/helperFunctions.js');

var thisPath = window.location.pathname;

if ((0, _helperFunctions.isProfilePage)(thisPath)) {
  (0, _getUserAssets.getUserAssets)('https://makegains.herokuapp.com/user/exercises', null);
  (0, _getUserAssets.getUserAssets)('https://makegains.herokuapp.com/user/programs', null);
  (0, _getUserAssets.getUserAssets)('https://makegains.herokuapp.com/user/workouts', null);
}

if ((0, _helperFunctions.isExerciseDetailPage)(thisPath)) {
  (0, _exerciseData.displayExerciseHistory)();
}

},{"./modules/exerciseData.js":2,"./modules/getUserAssets.js":3,"./modules/helperFunctions.js":4,"./modules/sort.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayExerciseHistory = undefined;

var _httpRequest = require('./httpRequest.js');

function displayExerciseHistory() {
  // set placeholders
  var data = void 0;

  // create url for http request
  var pageUrl = window.location.href;
  var tempArray = pageUrl.split('/');
  var exerciseId = tempArray.pop();
  tempArray.push('api', exerciseId);
  var apiUrl = tempArray.join('/');

  // GET the data for this particular exercise
  (0, _httpRequest.get)(apiUrl).then(function (response) {
    data = JSON.parse(response);
    displayTrend(data);
  }, function (error) {
    data = 'An error has occured!';
  });
}

// Functions which can be called to display the data in a specific way
// Each function will format data and then pass it to a method to display it

/* Parses every oneRepMax entry for a single exercise
   and pulls out the highest one for each exercise session */
function displayTrend(data) {
  var programs = data.exerciseHistory;
  var oneRepMaxArray = programs.map(function (programSession) {
    return programSession.dataHistory.map(function (datePerformance) {
      return datePerformance.oneRepMax;
    }).sort().pop();
  });
  var dateArray = programs.map(function (programSession) {
    var dateify = new Date(programSession.date);
    var formattedDate = dateify.toLocaleDateString();
    return formattedDate;
  });
  var datasetLabel = data.name;
  var dataPointLabels = dateArray;
  createLineChart(datasetLabel, dataPointLabels, oneRepMaxArray);
}

// creates a Chart with provided data
function createLineChart(theExercise, dateCompletedArray, strengthIndexArray) {
  // define context and create chart
  var c = document.getElementById('results');
  var context = c.getContext('2d');

  var results = new Chart(context, {

    type: 'line',

    data: {
      labels: dateCompletedArray,
      datasets: [{
        label: theExercise,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'round',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        data: strengthIndexArray,
        spanGaps: true
      }]
    },

    options: {
      legend: {
        display: false
      }
    }

  });
}

exports.displayExerciseHistory = displayExerciseHistory;

},{"./httpRequest.js":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserAssets = undefined;

var _httpRequest = require('./httpRequest.js');

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

  // flow of logic
  (0, _httpRequest.get)(path).then(function (response) {
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
      response.data = undefined;
    } else {
      response.data = json;
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
    appendTo = document.getElementById('programs');
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
  return response.map(function (exercise) {
    return '<li class="list-group-item">\n              <a href="/exercise/detail/' + exercise._id + '">' + exercise.name + '</a>\n              <form method="post" action="/exercise/delete/' + exercise._id + '">\n                <button class="btn btn-danger" type="submit">Delete</button>\n              </form>\n              <form method="get" action="/exercise/edit/' + exercise._id + '">\n                <button class="btn btn-warning right-buffer" type="submit">Edit</button>\n              </form>\n            </li>';
  }).join('');
}

function displayWorkout(response) {
  return response.map(function (workout) {
    var localDate = new Date(workout.date).toLocaleString();
    return '<li class="list-group-item">\n              <a href="/workout/detail/' + workout._id + '">' + localDate + '</a>\n              <form method="post" action="/workout/delete/' + workout._id + '">\n                <button class="btn btn-danger" type="submit">Delete</button>\n              </form>\n            </li>';
  }).join('');
}

function displayProgram(response) {
  return response.map(function (program) {
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

exports.getUserAssets = getUserAssets;

},{"./httpRequest.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// checks if the URL is the user's profile page
// 'thisPath' = the requested url path following the protocol and hostname
function isProfilePage(thisPath) {
  var userProfileLocation = '/user';
  var bool = undefined;

  thisPath === userProfileLocation ? bool = true : bool = false;

  return bool;
}

// checks if the URL is the the page to display an exercise's history
// 'thisPath' = the requested url path following the protocol and hostname
function isExerciseDetailPage(thisPath) {
  var exerciseDetailLocation = '/exercise/detail';
  var bool = undefined;

  // remove the exerciseID from the path requested
  var pathArray = thisPath.split('/');
  pathArray.pop();
  var path = pathArray.join('/');

  path === exerciseDetailLocation ? bool = true : bool = false;

  return bool;
}

exports.isProfilePage = isProfilePage;
exports.isExerciseDetailPage = isExerciseDetailPage;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// define function to make an http request using a promise
function get(url) {
  // contain XMLHttpRequest within a promise
  return new Promise(function (resolve, reject) {

    // data for the request
    var request = new XMLHttpRequest();
    request.open('GET', url);

    // promise is fulfilled with either the data or an error
    request.onload = function () {
      if (request.status == 200 && request.readyState == 4) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };

    // error handling for request
    request.onerror = function () {
      reject(Error("Unable to get data"));
    };

    // send the request
    request.send();
  });
}

exports.get = get;

},{}],6:[function(require,module,exports){
"use strict";

},{}]},{},[1]);
