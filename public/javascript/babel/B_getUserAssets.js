// makes an ajax request for a user's exercises, programs, or workouts
// then displays it on the DOM in the appropriate location
function getUserAssets(url, delimeter) {
  let path;

  if (delimeter !== null) {
    path = url + '/' + delimeter;
  } else {
    path = url;
  }

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
// then returns a formatted version of the data
function handleSpecificResponseType(json) {
  return new Promise((resolve, reject) => {

    let sampleCase = json[0];
    let response = { data: json };
    if (isExercise(sampleCase)) {
      response.type = 'exercise';

    } else if (isWorkout(sampleCase)) {
      response.type = 'workout';

    } else if (isProgram(sampleCase)) {
      response.type = 'program';

    } else {
      var errorMessage = 'An error has occured parsing the server response';
    }

    errorMessage === undefined ? resolve(response) : reject(Error(errorMessage));
  });
}

// writes the reponse to the DOM based on what type of data is received
function displayResponse(response, typeOfData) {
  let appendTo;
  let ul = document.createElement('ul');
  ul.classList.add('list-group');

  if (typeOfData = 'exercise') {
    appendTo = document.getElementById('exercises');
    ul.innerHTML = response.map(exercise => {
      return `<li class="list-group-item">
                <a href="/exercise/detail/${exercise._id}">${exercise.name}</a>
                <form method="post" action="/exercise/delete/${exercise._id}">
                  <button class="btn btn-danger" type="submit">Delete</button>
                </form>
                <form method="get" action="/exercise/edit/${exercise.name}">
                  <button class="btn btn-warning right-buffer" type="submit">Edit</button>
                </form>
              </li>`
    }).join('');

  } else if (typeOfData = 'workout') {
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

  } else {
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
