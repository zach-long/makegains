import { getUserAssets } from './modules/getUserAssets.js';
import { displayExerciseHistory } from './modules/exerciseData.js';
import { setSortingListeners } from './modules/sort.js';
import { isProfilePage, isExerciseDetailPage } from './modules/helperFunctions.js';

let thisPath = window.location.pathname;

if (isProfilePage(thisPath)) {
  // populate with initial user data
  getUserAssets('https://makegains.herokuapp.com/user/exercises', null);
  getUserAssets('https://makegains.herokuapp.com/user/programs', null);
  getUserAssets('https://makegains.herokuapp.com/user/workouts', null);

  // set event listeners to sort categories
  setSortingListeners();
}

if (isExerciseDetailPage(thisPath)) {
  // display a chart with exercise data over time
  displayExerciseHistory();
}
