var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development'
});

connection.connect();



var insert_orders = function(meal_type,order_status,owner_id,resturant,menu_img) {
 var order_data={
   meal_type="lunch",
   order_status="waiting",
   owner_id=1,
   resturant="teema",
   menu_img="xxxx"

 }
 connection.query("insert into orders set ?",order_data,function(err){
   if(err){
     console.log("the order wasnt inserted");
   }else{
     console.log("inserted order");
   }
 });
}


var update_orders = function(order_status,owner_id,order_id) {

 var query="update orders set order_status='"+order_status+"' where owner_id='"+owner_id+"' and order_id='"+order_id+"'";
 connection.query(query,function(err){
   if(err){
     console.log("the order wasnt inserted");
   }else{
     console.log("inserted order");
   }
 });
}




var newsfeed_orders = function() {
	var query = "SELECT name,meal_type FROM orders_users as ou and orders as o and users as u and orders_items as oi WHERE o.owner_id=ou.order_id and u.user_id=ou.user_id and oi.order_id=ou.order_id order by order_date limit 5"
	connection.query(query, function(err, rows, fields) {
		if(!err)
			console.log("");
		else
			console.log("");
	});
}

var user_latest_orders = function(user_id) {
	var query = "SELECT meal_type FROM  orders as o and users as u and orders_items as oi WHERE o.owner_id='"+ user_id+"' and oi.order_id='"+user_id+"' order by order_date limit 5"
	connection.query(query, function(err, rows, fields) {
		if(!err)
			console.log("");
		else
			console.log("");
	});
}



connection.end();
