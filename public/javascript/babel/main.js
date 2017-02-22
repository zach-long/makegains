import { getUserAssets, displayResponse } from './modules/getUserAssets.js';
import { displayExerciseHistory } from './modules/exerciseData.js';
import { setExerciseSortingListeners } from './modules/sort.js';
import { isProfilePage, isExerciseDetailPage } from './modules/helperFunctions.js';

let thisPath = window.location.pathname;

if (isProfilePage(thisPath)) {
  // populate with initial user data
  getUserAssets('https://makegains.herokuapp.com/user/exercises', null)
  .then((data) => {
    displayResponse(data);
  });
  getUserAssets('https://makegains.herokuapp.com/user/programs', null)
  .then((data) => {
    displayResponse(data);
  });
  getUserAssets('https://makegains.herokuapp.com/user/workouts', null)
  .then((data) => {
    displayResponse(data);
  });

  // set event listeners to sort categories
  setExerciseSortingListeners();
}

if (isExerciseDetailPage(thisPath)) {
  // display a chart with exercise data over time
  displayExerciseHistory();
}
