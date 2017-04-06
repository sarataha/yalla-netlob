var express = require('express');
var router = express.Router();

/* GET friends page. */
router.get('/', function(req, res, next) {
  res.render('friends', {
  	title: 'Friends',
  	username: 'Sara'
  });
});

module.exports = router;
