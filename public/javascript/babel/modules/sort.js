import { getUserAssets, displayResponse } from './getUserAssets.js';

function setSortingListeners(category) {
  let sortingButtons = document.getElementsByClassName(`${category}-category`);
  let APIurl = `https://makegains.herokuapp.com/user/${category}s`;
  let categoryFieldId = `${category}-list`;
  let currentDisplay = document.getElementById('exercise-category-type');

  Array.prototype.filter.call(sortingButtons, (sortingButton) => {
    sortingButton.addEventListener('click', () => {
      let sortBy = sortingButton.innerHTML;
      currentDisplay.innerHTML = sortBy;
      if (sortBy === 'All') {
        getUserAssets(APIurl, null)
        .then((data) => {
          clearField(categoryFieldId, () => {
            displayResponse(data.data, data.type);
          });
        });
      } else {
        getUserAssets(APIurl, sortBy)
        .then((data) => {
          clearField(categoryFieldId, () => {
            displayResponse(data.data, data.type);
          });
        });
      }
    });
  });
}

function clearField(idOfField, cb) {
  let field = document.getElementById(idOfField);
  field.remove();
  cb();
}

function setExerciseSelectListeners() {
  let sortingButtons = document.getElementsByClassName('exercise-category');
  let exerciseSelections = document.getElementsByTagName('option');
  let selectionArray = [...exerciseSelections];
  let currentDisplay = document.getElementById('exercise-category-type');

  Array.prototype.filter.call(sortingButtons, (sortingButton) => {
    sortingButton.addEventListener('click', () => {
      let sortBy = sortingButton.innerHTML;

      currentDisplay.innerHTML = sortBy;
      selectionArray.forEach((selection) => {
        if (sortBy === 'All') {
          selection.classList.remove('hidden');
        } else if (selection.dataset.category === sortBy) {
          selection.classList.remove('hidden');
        } else {
          selection.classList.add('hidden');
        }
      });

    });
  });
}

export { setSortingListeners, setExerciseSelectListeners };
