var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Yalla Netlob | Login' });
});
router.get('/register', function(req, res, next) {
  res.render('Registration', { title: 'Yalla Netlob | Registration' });
});


/* GET friends page. */
router.get('/friends', function(req, res, next) {
  res.render('friends', { title: 'Yalla Netlob | Friends' });
});

/* GET groups page. */
router.get('/groups', function(req, res, next) {
  res.render('groups', { title: 'Yalla Netlob | Groups' });
});

/* GET orders page. */
router.get('/orders', function(req, res, next) {
  res.render('index', { title: 'Yalla Netlob | Orders' });
});

/* GET new order page. */
router.get('/new_order', function(req, res, next) {
  res.render('new_order', { title: 'New Order' });
});

/* GET order details page. */
router.get('/order_details', function(req, res, next) {
  res.render('order_details', { title: 'Order Details' });
});

module.exports = router;
