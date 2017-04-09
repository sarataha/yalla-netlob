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

router.get('/',middlewareBodyParser,function(req, res) {
  console.log("******************************* order_id");
  console.log(req.query.order_id);
  res.render("order_details.ejs",{
        title: 'order_details',
        username: req.user.user_name,
        userID: req.user.user_id,
      });
  // var query="select meal_type,order_status,resturant from orders where order_id='"+order_id+"'";
  // connection.query(query,function(err,row,fields){
  //   if(!err){
  //     console.log("****************************************************");
  //     console.log(row[0]);
  //     console.log(row[1]);
  //     console.log(req.user.user_id);
  //     res.render('orders.ejs', {
  //       title: 'Orders',
  //       username: req.user.user_name,
  //       userID:req.user.user_id,
  //       orders:row
  //     });
  //   }
  //   else {
  //     console.log("error");
  //   }
  // });

});
module.exports = router;
