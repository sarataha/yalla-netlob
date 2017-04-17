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
router.get('/',isLoggedIn,function(req, res, next) {
  var user_id=req.user.user_id;

  var query="select orders.order_id,meal_type,order_status,resturant, notifications.* from orders,notifications where owner_id='"+user_id+"'";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("****************************************************roooooooow");
      console.log(row[0]);
      console.log(row[1]);
      console.log(req.user.user_id);
      console.log(row[0]);

      if(row){
      res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID:req.user.user_id,
        avatar: req.user.avatar_url,
        orders:row,
        row:row
      });
    }else{
      connection.query("SELECT * FROM notifications", function(err, rows) {
      if (err) {
        console.log(err);
      }
      else{
        console.log(rows);
      res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
        groups: "",
        row:rows
      });
    }
    });
    }
    }
    else {
      console.log("error");
    }
  });

});

/* GET new order page. */
// router.get('/new_order', function(req, res, next) {
//   res.render('new_order', {
//   	title: 'New Order',
//   	username: 'Sara',
//   });
// });

router.put('/',middlewareBodyParser,function(req, res) {
  //io.on("finish","hey finish");
  console.log("******************************* order_id");
  console.log(req.body.order_id);
  order_id=req.body.order_id;
  var query="update orders set order_status='finished' where order_id="+order_id;
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("**************************************************** update successed");
      console.log(req.user.user_id);
      res.send({message:"finish",order_id:order_id});
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
       res.send({message:"cancel",order_id:order_id});
         }
     else {
       console.log("error");
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
