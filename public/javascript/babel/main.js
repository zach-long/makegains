import { getUserAssets, displayResponse } from './modules/getUserAssets.js';
import { displayExerciseHistory } from './modules/exerciseData.js';
import { setSortingListeners, setExerciseSelectListeners } from './modules/sort.js';
import { isProfilePage, isExerciseDetailPage, isWorkoutLogPage } from './modules/helperFunctions.js';

let thisPath = window.location.pathname;

if (isProfilePage(thisPath)) {
  // populate with initial user data
  getUserAssets('https://makegains.herokuapp.com/user/exercises', null)
  .then((data) => {
    displayResponse(data.data, data.type);
  });
  getUserAssets('https://makegains.herokuapp.com/user/programs', null)
  .then((data) => {
    displayResponse(data.data, data.type);
  });
  getUserAssets('https://makegains.herokuapp.com/user/workouts', null)
  .then((data) => {
    displayResponse(data.data, data.type);
  });

  // set event listeners to sort categories
  setSortingListeners('exercise');
}

if (isExerciseDetailPage(thisPath)) {
  // display a chart with exercise data over time
  displayExerciseHistory();
}


if (isWorkoutLogPage(thisPath)) {
  // set event listeners for sorting
  setExerciseSelectListeners();
}
