var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
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

/* GET orders page. */
router.get('/',isLoggedIn,function(req, res, next) {
  var user_id=req.user.user_id;

  var query="select o.order_id,meal_type,order_status,resturant,invited_count from orders as o where o.owner_id="+user_id+" or o.order_id in(select order_id from orders_users where user_id="+user_id+") group by order_id;SELECT * FROM notifications;select count(order_id) as join_count from orders_users group by order_id;";
  connection.query(query,function(err,row,fields){
    if(!err){
      console.log("****************************************************roooooooow");
      console.log(row);
      console.log(row[2][0].join_count);
      var joined=[];
      // console.log(req.user.user_id);
      // console.log(row[0]);
      // console.log("heresldmfskadfzn.mdf,s/dmfnakm.f,");
      // console.log(row[2]);
      // console.log(row[2].join_count);
      // console.log(row[2].length);

      //join_count=row[2][0].join_count;
      if(row.length>0 ){
      if(row[2].length>0){
      	
      	for(var i=0;i<row[2].length;i++){
      			joined.push(row[2][i].join_count);
      	}

      	for(var j=joined.length;j<row[0].length;j++){
      		joined.push(0);
      	}

      	console.log("Joiiiiiiiiiiiiiiined")
      	console.log(joined);
        res.render('orders.ejs', {
          title: 'Orders',
          username: req.user.user_name,
          userID:req.user.user_id,
          avatar: req.user.avatar_url,
          orders:row[0],
          row:row[1],
          joined:joined,
          cls: ["inactive","inactive","inactive","active"]
        });
      }else{
        res.render('orders.ejs', {
          title: 'Orders',
          username: req.user.user_name,
          userID:req.user.user_id,
          avatar: req.user.avatar_url,
          orders:row[0],
          row:row[1],
          joined:[{join_count:0}],
          cls: ["inactive","inactive","inactive","active"]
        });
      }
    }else{
      connection.query("SELECT * FROM notifications", function(err, rows) {
      if (err) {
        console.log(err);
      }
      else{
        if(rows) {
        console.log(rows);
        res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
        groups: "",
        row:rows,
        cls: ["inactive","inactive","inactive","active"]
      });
      }
      else {
        res.render('orders.ejs', {
        title: 'Orders',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
        groups: "",
        row:[],
        cls: ["inactive","inactive","inactive","active"]
      });
      }
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
   var query = "SELECT * FROM orders_users WHERE order_id = ?";
   connection.query(query,[order_id],function (err,rows) {
     // body...
     if (err) {
      console.log(err);
     }
     else {
      order_users = rows.user_id;
      var query="delete from orders where order_id="+order_id;
      connection.query(query,function(err,row,fields){
      if(!err){
       console.log("****************************************************delete successed");
       console.log(req.user.user_id);
       res.send({message:"cancel",order_id:order_id,owner_id:req.user.user_id,order_users:order_users});
         }
     else {
       console.log("error");
     }
    });
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
