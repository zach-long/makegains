import { get } from './httpRequest.js';

// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function getUserAssets(url, delimeter) {
  let path;

  if (delimeter !== null) {
    path = url + '/' + delimeter;
  } else {
    path = url;
  }

  // define type of request
  let tempArray = url.split('/');
  let reqType = tempArray.pop();

  // flow of logic
  get(path)
  .then(response => {
    let data = JSON.parse(response);

    handleSpecificResponseType(data, reqType)
    .then(identifiedData => {
      displayResponse(identifiedData.data, identifiedData.type);

    }, err => {
      console.log('Error in function "handleSpecficResponseType()"');
    });
  }, err => {
    console.log('Error retrieving data in "getUserAssets()"');
  });
}

// determines whether the response was an exercise or a program or a workout
// then assigns a type to it for further processing
function handleSpecificResponseType(json, reqType) {
  return new Promise((resolve, reject) => {

    // check if data exists by sampling json data
    let sample = json[0];

    // initialize empty response object
    let response = {};

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
  let loadingFields = document.getElementsByClassName('loading');
  for (let i = 0; i < loadingFields.length; i++) {
    loadingFields[i].classList.add('hidden');
  }

  // initialize HTML which is a part of every DOM addition
  let appendTo;
  let ul = document.createElement('ul');
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

function displayWorkout(response) {
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

function displayProgram(response) {
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

function displayNodataExercise() {
  return `<li class="list-group-item text-center">
            Add exercises to your account so you can add them to programs, log them in your workouts, and track your progress!
          </li>`;
}

function displayNodataWorkout() {
  return `<li class="list-group-item text-center">
            You don't have any workouts logged yet! Add exercises so you can include them in logged workouts. Workouts can be free-form or follow a pre-defined program. Track your workouts so can start recording progress!
          </li>`;
}

function displayNodataProgram() {
  return `<li class="list-group-item text-center">
            Have a few workouts that are "set-in-stone"? Input a your workout program so you can use it as a template while logging sets!
          </li>`;
}

export { getUserAssets };
