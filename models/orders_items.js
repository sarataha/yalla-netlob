// ./models/users.js

var mysql = require('mysql');
// var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});

connection.connect(function(err){
  if(err){
    console.log("error to connect to mysql server");
    return;
  }else{
    console.log("connected succesfully");
  }
});


var insert_order_items = function(order_id,user_id,item,amount,comment,order_date,price) {
 
   var items = {
   		order_id:1,
   		user_id:2,
   		item:"spicy pizza",
   		amount:2,
   		comment:"extra sauce",
   		order_date:"2017-04-07",
   		price:100
         
     };
   var query = "INSERT INTO orders_items SET ?";
   connection.query(query, items, function(err, result) {
     if (err)
       console.log(err);
     else
       console.log(result);
   });
}

// find user's friends
var select_items_in_order = function(order_id) {
  var query = "SELECT * FROM orders_items WHERE order_id ='" + order_id
  connection.query(query, function(err, rows, fields) {
    if(!err)
      if (rows.length > 0)
        console.log('User found: ', rows);
      else
        console.log('invalid user data');
    else
      console.log("");
  });
}
// test connection
var remove_order_item=function(order_id,user_id){
  var data={
  	order_id: order_id,
  	user_id: user_id
  };
  var query="delete from group_members where ?";
  connection.query(query,data,function(err,resault){
    if(err)
      console.log(err);
    else
      console.log(resault);
  });
}

connection.end();