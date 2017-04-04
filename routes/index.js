var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yalla Netlob | Login' });
});
router.get('/register', function(req, res, next) {
  res.render('Registration', { title: 'Yalla Netlob | Registration' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Yalla Netlob | Login' });
});

module.exports = router;
