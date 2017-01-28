var states = [
  'authenticate',
  'profile',
  'createExercise',
  'createWorkout',
  'exerciseDetail',
  'logWorkout'
]

function setState(state) {
  ejs.render('main.ejs', {state: state});
}
