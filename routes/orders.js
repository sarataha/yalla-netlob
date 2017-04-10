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

  var query="select order_id,meal_type,order_status,resturant from orders where owner_id='"+user_id+"'";
  connection.query(query,function(err,row,fields){
    if(!err){
      if(row){
      res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID:req.user.user_id,
        orders:row
      });
    }else{
      res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID:req.user.user_id,
        orders:{}
      });
    }
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

router.put('/',middlewareBodyParser,function(req, res) {
  console.log("******************************* order_id");
  console.log(req.body.order_id);
  order_id=req.body.order_id;
  var query="update orders set order_status='finished' where order_id="+order_id;
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("**************************************************** update successed");
      console.log(req.user.user_id);
        }
    else {
      console.log("error");
    }
 });
 });


 router.delete("/",middlewareBodyParser,function(req, res) {
   order_id=req.body.order_id;
   var query="delete from orders where order_id="+order_id;
   connection.query(query,function(err,row,fields){
     if(!err){
       console.log("****************************************************delete successed");
       console.log(req.user.user_id);
       
         }
     else {
       console.log("error");
     }
  });
});


module.exports = router;
