// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function getUserAssets(url, delimeter) {
  let path;

  if (delimeter !== null) {
    path = url + '/' + delimeter;
  } else {
    path = url;
  }

  // flow of logic
  get(path)
  .then(response => {
    let data = JSON.parse(response);

    handleSpecificResponseType(data)
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
function handleSpecificResponseType(json) {
  return new Promise((resolve, reject) => {

    // use the first index of the returned json as a sample to determine the type of the dataset
    let sampleCase = json[0];
    // initialize the empty data object
    let response = {};
    // If there is not data
    if (sampleCase === undefined) {
      response.data = 'You have no data for this yet!';
      response.type = 'none';
      resolve(response);

    // If the data is an Exercise
    } else if (isExercise(sampleCase)) {
      response.data = json;
      response.type = 'exercise';
      resolve(response);

    // If the data is a workout
    } else if (isWorkout(sampleCase)) {
      response.data = json;
      response.type = 'workout';
      resolve(response);

    // If the data is a program
    } else if (isProgram(sampleCase)) {
      response.data = json;
      response.type = 'program';
      resolve(response);

    // I messed up
    } else {
      reject(Error('An error has occured, sorry this isn\'t more specific!'));
    }
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

  // else if - displays the HTML for when no data is present
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

  // Something bad happened
  } else {
    alert(":(");
  }

  // Apply result to the DOM
  appendTo.appendChild(ul);
}

// functions to check the type of the json response
function isExercise(sample) {
  return sample.hasOwnProperty('exerciseHistory') ? true : false;
}
function isWorkout(sample) {
  return sample.hasOwnProperty('date') ? true : false;
}
function isProgram(sample) {
  if (!isExercise(sample) && !isWorkout(sample)) {
    return true;
  } else {
    return false;
  }
}

// GET initial data from the server
getUserAssets('https://makegains.herokuapp.com/user/exercises', null);
getUserAssets('https://makegains.herokuapp.com/user/programs', null);
getUserAssets('https://makegains.herokuapp.com/user/workouts', null);
