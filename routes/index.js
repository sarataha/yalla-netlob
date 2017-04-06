var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  	title: 'Home',
  	username: 'Sara'
  });
});
router.get('/register', function(req, res, next) {
  res.render('Registration', { title: 'Registration' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;