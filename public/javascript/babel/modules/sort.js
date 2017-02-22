import { getUserAssets, displayResponse } from './getUserAssets.js';

function setExerciseSortingListeners() {
  let exerciseTypeButtons = document.getElementsByClassName('exercise-category');
  let exerciseUrlAPI = 'https://makegains.herokuapp.com/user/exercises';
  let exerciseListId = 'exercise-list';

  Array.prototype.filter.call(exerciseTypeButtons, (exerciseTypeButton) => {
    exerciseTypeButton.addEventListener('click', () => {
console.log(`clicked ${this}`)
      let sortBy = exerciseTypeButton.innerHTML;
console.log(`sort this filed by ${sortBy}`)
      getUserAssets(exerciseUrlAPI, sortBy)
      .then((data) => {
console.log(`got data: ${data}`)
        clearField(exerciseListId, () => {
console.log(`after field cleared, display response`)
          displayResponse(data);
        });
      });
    });
  });
}

function clearField(idOfField, cb) {
console.log(`clearing field for new data`)
console.log(`field is ${field}`)
  let field = document.getElementById(idOfField);
  field.remove();
console.log(`sending cb`)
  cb();
}

export { setExerciseSortingListeners };
