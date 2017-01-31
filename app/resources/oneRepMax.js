'use strict';

function calculate(weight, reps) {
  const percentages = {
    1  :  1,
    2  :  .95,
    3  :  .93,
    4  :  .90,
    5  :  .87,
    6  :  .85,
    7  :  .83,
    8  :  .80,
    9  :  .77,
    10 :  .75,
    11 :  .73,
    12 :  .70
  }

  let assumedPercent = percentages[reps];
  let assumedMax = Math.floor(weight / assumedPercent);

  return assumedMax;
}

module.exports = calculate;
