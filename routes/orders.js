var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development'
});

connection.connect();
/* GET orders page. */
router.get('/', function(req, res, next) {
  var query="select meal_type,order_status,resturant from orders";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("****************************************************");
      console.log(row[0]);
    }
    else {
      console.log("error");
    }
  });
  res.render('orders', {
  	title: 'Orders',
  	username: 'Sara',
    userID:1
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
