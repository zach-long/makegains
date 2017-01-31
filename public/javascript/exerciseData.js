'use strict';

// set placeholders
var data;

// create url for http request
var pageUrl = window.location.href;
var tempArray = pageUrl.split('/');
var exerciseId = tempArray.pop();
tempArray.push('api', exerciseId);
var apiUrl = tempArray.join('/');

// GET the data for this particular exercise
get(apiUrl).then(function (response) {
  data = JSON.parse(response);
  displayTrend(data);
}, function (error) {
  data = 'An error has occured!';
});

// Functions which can be called to display the data in a specific way
// Each function will format data and then pass it to a method to display it

/* Parses every oneRepMax entry for a single exercise
   and pulls out the highest one for each exercise session */
function displayTrend(data) {
  var workouts = data.exerciseHistory;
  var oneRepMaxArray = workouts.map(function (workoutSession) {
    return workoutSession.dataHistory.map(function (datePerformance) {
      return datePerformance.oneRepMax;
    }).sort().pop();
  });
  var dateArray = workouts.map(function (workoutSession) {
    var dateify = new Date(workoutSession.date);
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
