var express = require('express');
var router = express.Router();

/* GET friends page. */
router.get('/', function(req, res, next) {
  res.render('friends', { title: 'Yalla Netlob | Friends', name: 'Sara' });
});

module.exports = router;
