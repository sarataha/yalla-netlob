var mysql=require('mysql');
var express = require('express');
var router = express.Router();
var router = require('express').Router();
var dbconfig = require('../models/users');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + dbconfig.database);

connection.query('USE ' + dbconfig.database);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});

connection.connect();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('profile', {
//   	title: 'Profile',
//   	username: 'Sara'
//   });
// });
router.get("/",function(req,res){
  var user_id=req.query.user_id;
  console.log(user_id);
console.log("Rendering users ***********");
  connection.query("SELECT * FROM users where user_id= ?;select * from notifications;",user_id, function(err, rows) {
    console.log(rows);
    if (err)
    	console.log(err);
    else{
    if (rows[0].length>0) {
      //console.log("user name: "+rows[0].avatar_url);
      res.render('users.ejs', {
      	title: 'Friend',
      	username: req.user.user_name,
        userID:req.user.user_id,
        avatar: req.user.avatar_url,
        row:rows[1],
        user_name:rows[0][0].user_name,
        user_id:rows[0][0].user_id,
        user_img:rows[0][0].avatar_url,
        user_email:rows[0][0].email,
        cls: ["inactive","inactive","inactive","inactive"]
      });
  //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

    }
}
  });
});

module.exports = router;
