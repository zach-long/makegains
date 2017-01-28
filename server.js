'use strict';

// modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

// set constants
const mongoPath = 'mongodb://localhost/workout-tracker_db';
const localPort = 3000;
const LocalStrategy = require('passport-local').Strategy;
const app = express();

// connect database
mongoose.connect(process.env.MONGODB_URI || mongoPath, (err) => {
  if (err) throw err;
  console.log('MongoDB connected successfully!');
});

// import routes
const routes = require('./app/routes/index.js');
const userRoutes = require('./app/routes/userRoutes.js');
const workoutRoutes = require('./app/routes/workoutRoutes.js');
const exerciseRoutes = require('./app/routes/exerciseRoutes.js');

// set EJS as view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set public directory
app.use(express.static(path.join(__dirname, 'public')));

// set session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// set passport
app.use(passport.initialize());
app.use(passport.session());

// set validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));

// set flash
app.use(flash());

// set locals and flash reporting variables
app.use((req, res, next) => {
  res.locals.user = req.user || undefined;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashFail = req.flash('fail');
  res.locals.passportError = req.flash('error');
  next();
});

// set routes
app.use('/', routes);
app.use('/user', userRoutes);
app.use('/workout', workoutRoutes);
app.use('/exercise', exerciseRoutes);

// start server
app.listen(process.env.PORT || localPort, function() {
  console.log('Server started on port ' + localPort);
});
