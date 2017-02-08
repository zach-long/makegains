'use strict';

// modules
const express = require('express');

// constants
const router = express.Router();

// set root response
router.get('/', (req, res) => {
  if (!req.user) {
    res.render('index');

  } else {
    res.redirect('/user');
  }
});

module.exports = router;
