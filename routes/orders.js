var express = require('express');
var router = express.Router();

/* GET orders page. */
router.get('/', function(req, res, next) {
  res.render('orders', {
  	title: 'Orders',
  	username: 'Sara'
  });
});

/* GET new order page. */
router.get('/new_order', function(req, res, next) {
  res.render('new_order', {
  	title: 'New Order',
  	username: 'Sara',
  });
});

/* GET order details page. */
router.get('/order_details', function(req, res, next) {
  res.render('order_details', {
  	title: 'Order Details',
  	username: 'Sara'
  });
});

module.exports = router;
