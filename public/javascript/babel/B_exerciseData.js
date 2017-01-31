// set placeholders
var data;

// create url for http request
var pageUrl = window.location.href;
var tempArray = pageUrl.split('/');
var exerciseId = tempArray.pop();
tempArray.push('api', exerciseId);
var apiUrl = tempArray.join('/');

// GET the data for this particular exercise
get(apiUrl).then(
response => {
  data = JSON.parse(response);
  console.log(data);

}, error => {
  console.log(error);
  data = 'An error has occured!';
  console.log(data);
});

// Functions which can be called to display the data in a specific way
// Each function will format data and then pass it to a method to display it

//
function displayWorkoutHistory(data) {
  let workouts = data.exerciseHistory;
  console.log(workouts);
}

//
function displayDatePerformance(data, theDate) {
  let workouts = data.exerciseHistory;
  workouts.forEach(w => {
    if (w.date == theDate) {
      console.log(w);
    }
  });
}

/* Parses every oneRepMax entry for a single exercise
   and pulls out the highest one for each exercise session */
function displayTrend(data) {
  let workouts = data.exerciseHistory;
  let oneRepMaxArray = workouts.map(workoutSession => {
    return workoutSession.dataHistory.map(datePerformance => {
      return datePerformance.oneRepMax;
    }).sort().pop();
  });
  console.log(oneRepMaxArray);
}
