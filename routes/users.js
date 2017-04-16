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
  connection.query("SELECT * FROM users where user_id= ?",user_id, function(err, rows) {
    console.log(rows.length);
    if (err)
    return done(err);
    if (rows.length) {
      console.log("user name: "+rows[0].avatar_url);
      res.render('users.ejs', {
      	title: 'Friend',
      	username: rows[0].user_name,
        userID:rows[0].user_id,
        avatar: req.user.avatar_url,
        user_img:rows[0].avatar_url,
        user_email:rows[0].email
      });
  //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

    }
  });
});

module.exports = router;
