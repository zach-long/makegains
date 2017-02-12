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

    handleSpecficResponseType(data)
    .then(response => {
      displayResponse(typeOfData);

    }, err => {
      console.log('Error in function "handleSpecficResponseType()"');
    });

  }, err => {
    console.log('Error retrieving data in "getUserAssets()"');
  });
}

// determines whether the response was an exercise or a program or a workout
// then returns a formatted version of the data
function handleSpecificResponseType(data) {
  return new Promise((resolve, reject) => {



  });
}

// writes the reponse to the DOM based on what type of data is received
function displayResponse(typeOfData) {

}

getUserAssets('/user/exercises', null);
getUserAssets('/user/programs', null);
getUserAssets('/user/workouts', null);
