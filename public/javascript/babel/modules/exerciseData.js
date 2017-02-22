import { get } from './httpRequest.js';

function displayExerciseHistory() {
  // set placeholders
  let data;

  // create url for http request
  let pageUrl = window.location.href;
  let tempArray = pageUrl.split('/');
  let exerciseId = tempArray.pop();
  tempArray.push('api', exerciseId);
  let apiUrl = tempArray.join('/');

  // GET the data for this particular exercise
  get(apiUrl).then(
  response => {
    data = JSON.parse(response);
    displayTrend(data);

  }, error => {
    data = 'An error has occured!';
  });
}

// Functions which can be called to display the data in a specific way
// Each function will format data and then pass it to a method to display it

/* Parses every oneRepMax entry for a single exercise
   and pulls out the highest one for each exercise session */
function displayTrend(data) {
  let programs = data.exerciseHistory;
  let oneRepMaxArray = programs.map(programSession => {
    return programSession.dataHistory.map(datePerformance => {
      return datePerformance.oneRepMax;
    }).sort().pop();
  });
  let dateArray = programs.map(programSession => {
    let dateify = new Date(programSession.date);
    let formattedDate = dateify.toLocaleDateString();
    return formattedDate;
  });
  let datasetLabel = data.name;
  let dataPointLabels = dateArray;
  createLineChart(datasetLabel, dataPointLabels, oneRepMaxArray);
}

// creates a Chart with provided data
function createLineChart(theExercise, dateCompletedArray, strengthIndexArray) {
  // define context and create chart
  let c = document.getElementById('results');
  let context = c.getContext('2d');

  let results = new Chart(context, {

    type: 'line',

    data: {
      labels: dateCompletedArray,
      datasets: [
        {
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
          spanGaps: true,
        }
      ]
    },

    options: {
      legend: {
        display: false
      }
    }

  });
}

export { displayExerciseHistory };
