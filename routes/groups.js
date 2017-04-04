var express = require('express');
var router = express.Router()

/* GET groups page. */
router.get('/', function(req, res, next) {
  res.render('groups', { title: 'Yalla Netlob | Groups' });
});

module.exports = router;
