'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// set root response
router.get('/', (req, res) => {
  if (!req.user) {
    res.render('index', {state: 'authentication'});

  } else {
    console.log(req.user);
    res.render('index', {state: 'profile'});
  }
});

module.exports = router;
