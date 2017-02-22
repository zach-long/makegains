import { getUserAssets, displayResponse } from './getUserAssets.js';

function setExerciseSortingListeners() {
  let exerciseTypeButtons = document.getElementsByClassName('exercise-category');
  let exerciseUrlAPI = 'https://makegains.herokuapp.com/user/exercises';
  let exerciseListId = 'exercise-list';

  Array.prototype.filter.call(exerciseTypeButtons, (exerciseTypeButton) => {
    exerciseTypeButton.addEventListener('click', () => {
      let sortBy = exerciseTypeButton.innerHTML;
      getUserAssets(exerciseUrlAPI, sortBy)
      .then((data) => {
        clearField(exerciseListId, () => {
          displayResponse(data.data, data.type);
        });
      });
    });
  });
}

function clearField(idOfField, cb) {
  let field = document.getElementById(idOfField);
  field.remove();
  cb();
}

export { setExerciseSortingListeners };
