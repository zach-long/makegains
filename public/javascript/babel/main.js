import { getUserAssets } from './modules/getUserAssets.js';
import { displayExerciseHistory } from './modules/exerciseData.js';
import { sort } from './modules/sort.js';

// GET initial data from the server
getUserAssets('https://makegains.herokuapp.com/user/exercises', null);
getUserAssets('https://makegains.herokuapp.com/user/programs', null);
getUserAssets('https://makegains.herokuapp.com/user/workouts', null);
