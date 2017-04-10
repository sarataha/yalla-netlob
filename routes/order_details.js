var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/orders');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})

connection.query('USE ' + dbconfig.database);

router.get('/', function(req,res) {
	// body...
	res.render('order_details.ejs',{
		title: "Order Details",
		username: req.user.user_name,
		userID: req.user.user_id
	});
});

module.exports = router;