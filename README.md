# MakeGains
A Node.js and MongoDB web app for easy workout tracking and long-term progress aggregation.

I am still actively developing this but it is deployed at http://makegains.herokuapp.com while I optimize it and add features. The app is functional - you can track workouts and see progress metrics - but it's just not the most user friendly yet.

### To-do:
- [ ] Correct or replace Mongoose hook issues so that object references are eliminated or created appropriately as objects are created or deleted
- [ ] Protect routes based on certain parameters. i.e. Only the owner of an exercise should be able to view data about it
- [ ] Correct issue with API call behaving differently based on protocol
- [ ] Add UI scripting to sort Exercises/Programs/Workouts displayed
- [ ] Add functionality for a Workout to be logged based on a Program template
- [ ] Add a 'Data' page where a User can see metrics of all types

### Long term goals:
- [ ] Setup an efficient build system
- [ ] Open API routes for mobile app addition
- [ ] Add react native mobile app interface
