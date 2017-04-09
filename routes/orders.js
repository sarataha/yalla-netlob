var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development'
});

connection.connect();

/* GET orders page. */
router.get('/', middlewareBodyParser,function(req, res, next) {
  var user_id=req.user.user_id;

  var query="select meal_type,order_status,resturant from orders where owner_id='"+user_id+"'";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("****************************************************");
      console.log(row[0]);
      console.log(row[1]);
      console.log(req.user.user_id);
      res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID:req.user.user_id,
        orders:row
      });
    }
    else {
      console.log("error");
    }
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
// router.get('/order_details', function(req, res, next) {
//   res.render('order_details', {
//   	title: 'Order Details',
//   	username: 'Sara'
//   });
// });

module.exports = router;
