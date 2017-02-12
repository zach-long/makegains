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
// then assigns a type to it for further processing
function handleSpecificResponseType(json) {
  return new Promise((resolve, reject) => {

    let sampleCase = json[0];
    let response = { data: json };
    if (isExercise(sampleCase)) {
      response.type = 'exercise';
      resolve(response);

    } else if (isWorkout(sampleCase)) {
      response.type = 'workout';
      resolve(response);

    } else if (isProgram(sampleCase)) {
      response.type = 'program';
      resolve(response);

    } else {
      response.type = 'none';
      response.data = 'You have no data for this yet!';
      resolve(response);
    }

    reject(Error('An error has occured, sorry this isn\'t more specific!'));
  });
}

// writes the reponse to the DOM based on what type of data is received
function displayResponse(response, typeOfData) {
  let appendTo;
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
                <form method="get" action="/exercise/edit/${exercise.name}">
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

  } else {
    ul.innerHTML = `<li class="list-group-item">${response}`;
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
