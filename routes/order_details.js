var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/orders');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})

connection.query('USE ' + dbconfig.database);

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
      // return  res.render("order_details",{
      //         title: 'order_details',
      //         username: req.user.user_name,
      //         userID: req.user.user_id
      //       });

order_id=req.query.order_id;
  var query="select meal_type,order_status,resturant from orders where order_id='"+order_id+"'";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("****************************************************");
      console.log(row[0]);
      console.log(req.user.user_id);

      return res.render("order_details",{
            title: 'order_details',
            username: req.user.user_name,
            userID: req.user.user_id,
            order_data:row
          });

    }
    else {
      console.log("error");
    }
  });
//
  });

router.get('/', function(req,res) {
	// body...
	res.render('order_details.ejs',{
		title: "Order Details",
		username: req.user.user_name,
		userID: req.user.user_id
	});
});

module.exports = router;
