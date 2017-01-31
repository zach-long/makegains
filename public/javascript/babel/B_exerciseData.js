// set placeholders
var data;

// create url for http request
var pageUrl = window.location.href;
var tempArray = pageUrl.split('/');
var exerciseId = tempArray.pop();
tempArray.push('api', exerciseId);
var apiUrl = tempArray.join('/');

get(apiUrl).then(
response => {
  data = JSON.parse(response);
  console.log(data);

}, error => {
  console.log(error);
  data = 'An error has occured!';
  console.log(data);
});

function displayWorkoutHistory(data) {
  let workouts = data.exerciseHistory;
  console.log(workouts);
}

function displayDatePerformance(data, theDate) {
  let workouts = data.exerciseHistory;
  workouts.forEach(w => {
    if (w.date == theDate) {
      console.log(w);
    }
  });
}

function displayTrend(data) {
  let workouts = data.exerciseHistory;
  
}
