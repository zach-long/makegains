// checks if the URL is the user's profile page
// 'thisPath' = the requested url path following the protocol and hostname
function isProfilePage(thisPath) {
  let userProfileLocation = '/user';
  let bool = undefined;

  thisPath === userProfileLocation ? bool = true : bool = false;

  return bool;
}

// checks if the URL is the the page to display an exercise's history
// 'thisPath' = the requested url path following the protocol and hostname
function isExerciseDetailPage(thisPath) {
  let exerciseDetailLocation = '/exercise/detail';
  let bool = undefined;

  // remove the exerciseID from the path requested
  let pathArray = thisPath.split('/');
  pathArray.pop();
  let path = pathArray.join('/');

  path === exerciseDetailLocation ? bool = true : bool = false;

  return bool;
}

// checks if the URL is the the page to log a workout
// 'thisPath' = the requested url path following the protocol and hostname
function isWorkoutLogPage(thisPath) {
  let workoutLogLocation = '/workout/log';
  let bool = undefined;

  thisPath === workoutLogLocation ? bool = true : bool = false;

  return bool;
}

export { isProfilePage, isExerciseDetailPage, isWorkoutLogPage };
