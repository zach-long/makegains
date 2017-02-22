import { getUserAssets } from './modules/getUserAssets.js';
import { displayExerciseHistory } from './modules/exerciseData.js';
import { sort } from './modules/sort.js';
import { isProfilePage, isExerciseDetailPage } from './modules/helperFunctions.js';

let thisPath = window.location.pathname;

if (isProfilePage(thisPath)) {
  getUserAssets('https://makegains.herokuapp.com/user/exercises', null);
  getUserAssets('https://makegains.herokuapp.com/user/programs', null);
  getUserAssets('https://makegains.herokuapp.com/user/workouts', null);
}

if (isExerciseDetailPage(thisPath)) {
  displayExerciseHistory();
}
