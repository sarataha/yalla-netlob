var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/orders');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var http=require('http');
connection.query('USE ' + dbconfig.database);

var mysql     = require('mysql');
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});

connection.connect();

router.get('/',isLoggedIn,function(req, res) {
  console.log("******************************* order_id");
  console.log(req.query.order_id);
  var order_id=req.query.order_id;

  var query=" select users.user_name ,orders_items.* from orders_items,users where users.user_id=orders_items.user_id and orders_items.order_id="+order_id+";SELECT * FROM notifications;";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("**************************************************** Order Detailss");
      //console.log(row[0]);
      console.log(req.user.user_id);
      console.log(order_id);
      console.log("bal8888888888888888888")
      console.log(row.length);
      if(row[0].length>0){
        return res.render("order_details",{
              title: 'order_details',
              username: req.user.user_name,
              userID: req.user.user_id,
              avatar: req.user.avatar_url,
              order_data:row[0],
              row:row[1],
              cls: ["inactive","inactive","inactive","active"]
            });
        }else{
          //order_data=[{order_id:order_id}]
          connection.query("SELECT * FROM notifications",function (err,row) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(order_id);
              return res.render("order_details",{
                  title: 'order_details',
                  username: req.user.user_name,
                  userID: req.user.user_id,
                  avatar: req.user.avatar_url,
                  order_data:[{order_id:order_id}],
                  row:row,
                  cls: ["inactive","inactive","inactive","active"]
                });
            }
          });
        }
        }
    else {
      console.log(err);
    }
  });
  });

  router.post('/',middlewareBodyParser,function(req, res) {
    console.log("******************************* order_id post order_details");
    console.log(req.body.order_id);
    console.log(req.user.user_id);
    console.log(req.body.item_amount);
    console.log(req.body.comment);
    console.log(new Date());
    console.log(req.body.item_price);

    var items = {
       order_id:req.body.order_id,
       user_id:req.user.user_id,
       item:req.body.order_item,
       amount:req.body.item_amount,
       comment:req.body.comment,
       order_date:new Date(),
       price:req.body.item_price
      };
    console.log(items);
    console.log(req.user.user_name);
    // var query = "INSERT INTO orders_items SET ?";
    var query=connection.query("INSERT INTO orders_items SET ?",items, function(err,row,fields){
      if(!err){
        console.log("********************** Order item added succesfully");
        console.log(req.user.user_id);
        res.send({message:"order_details",user_name:req.user.user_name,items:items});
          }
      else {
        res.send({message:"no_order_details"});
        console.log(err);
      }
    });
    });

// route middleware to check:
function isLoggedIn(req, res, next) {

  // if the user is authenticated in the session, keep going
  if (req.isAuthenticated())
    return next();

  // else if they aren't then redirect them to the login/signup home page
  res.redirect('/');
}

module.exports = router;
