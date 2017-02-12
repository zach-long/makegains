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

  get(path).then(function (response) {
    var data = JSON.parse(response);

    handleSpecificResponseType(data).then(function (identifiedData) {
      displayResponse(identifiedData.data, identifiedData.type);
    }, function (err) {
      console.log('Error in function "handleSpecficResponseType()"');
    });
  }, function (err) {
    console.log('Error retrieving data in "getUserAssets()"');
  });
}

// determines whether the response was an exercise or a program or a workout
// then returns a formatted version of the data
function handleSpecificResponseType(json) {
  return new Promise(function (resolve, reject) {

    var sampleCase = json[0];
    var response = { data: json };
    if (isExercise(sampleCase)) {
      response.type = 'exercise';
    } else if (isWorkout(sampleCase)) {
      response.type = 'workout';
    } else if (isProgram(sampleCase)) {
      response.type = 'program';
    } else {
      response.type = 'none';
      response.data = 'You have no data for this yet!';
    }

    resolve(response);
  });
}

// writes the reponse to the DOM based on what type of data is received
function displayResponse(response, typeOfData) {
  var appendTo = void 0;
  var ul = document.createElement('ul');
  ul.classList.add('list-group');

  if (typeOfData == 'exercise') {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = response.map(function (exercise) {
      return '<li class="list-group-item">\n                <a href="/exercise/detail/' + exercise._id + '">' + exercise.name + '</a>\n                <form method="post" action="/exercise/delete/' + exercise._id + '">\n                  <button class="btn btn-danger" type="submit">Delete</button>\n                </form>\n                <form method="get" action="/exercise/edit/' + exercise.name + '">\n                  <button class="btn btn-warning right-buffer" type="submit">Edit</button>\n                </form>\n              </li>';
    }).join('');
  } else if (typeOfData == 'workout') {
    appendTo = document.getElementById('workouts');
    ul.innerHTML = response.map(function (workout) {
      var localDate = new Date(workout.date).toLocaleString();
      return '<li class="list-group-item">\n                <a href="/workout/detail/' + workout._id + '">' + localDate + '</a>\n                <form method="post" action="/workout/delete/' + workout._id + '">\n                  <button class="btn btn-danger" type="submit">Delete</button>\n                </form>\n              </li>';
    }).join('');
  } else if (typeOfData == 'program') {
    appendTo = document.getElementById('programs');
    ul.innerHTML = response.map(function (program) {
      return '<li class="list-group-item">\n                <a href="/program/detail/' + program._id + '">' + program.name + '</a>\n                <!--\n                <form method="get" action="/program/edit/' + program._id + '">\n                  <button class="btn btn-warning" type="submit">Edit</button>\n                </form>\n                <form method="post" action="/program/delete/' + program._id + '">\n                  <button class="btn btn-danger" type="submit">Delete</button>\n                </form>\n                -->\n              </li>';
    }).join('');
  } else {
    ul.innerHTML = '<li class="list-group-item">' + response;
    if (document.getElementById('exercises').innerHTML.length < 100) {
      appendTo = document.getElementById('exercises');
    } else if (document.getElementById('workouts').innerHTML.length < 100) {
      appendTo = document.getElementById('workouts');
    } else {
      appendTo = document.getElementById('programs');
    }
  }
  appendTo.appendChild(ul);
}

// functions to check the type of the json response
function isExercise(sample) {
  return sample.hasOwnProperty('exerciseHistory') ? true : false;
}
function isWorkout(sample) {
  return sample.hasOwnProperty('exercises') ? true : false;
}
function isProgram(sample) {
  if (!isExercise(sample) && !isWorkout(sample)) {
    return true;
  } else {
    return false;
  }
}

getUserAssets('https://makegains.herokuapp.com/user/exercises', null);
getUserAssets('https://makegains.herokuapp.com/user/programs', null);
getUserAssets('https://makegains.herokuapp.com/user/workouts', null);
