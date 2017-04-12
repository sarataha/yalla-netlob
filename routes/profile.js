var mysql=require('mysql');
var express = require('express');
var router = express.Router();
var router = require('express').Router();
var dbconfig = require('../models/users');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})

connection.query('USE ' + dbconfig.database);
// /* GET users listing. */
router.get("/",function(req,res){
  var user_id=req.user.user_id;
  console.log(user_id);
console.log("Rendering users ***********");
  connection.query("SELECT * FROM users where user_id= ?",user_id, function(err, rows) {
    console.log(rows.length);
    if (err)
    return done(err);
    if (rows.length) {
      console.log("user name: "+rows[0].avatar_url);
      res.render('profile.ejs', {
      	title: 'Profile',
      	username: rows[0].user_name,
        userID:rows[0].user_id,
        user_img:rows[0].avatar_url,
        user_email:rows[0].email
      });
  //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

    }
  });



  router.post("/updateUser",middlewareBodyParser,function(req,respo){
    console.log("updateUser"+req.body.name);
    var username=req.body.name;
    var user_id=req.body.user_id;
    var user_img=req.body.user_img;
    connection.query("update users set user_name=? ,avatar_url=? where user_id=?",[username,user_img,user_id], function(err, rows) {
      if (err)
      {respo.send("error")}
       else {
         console.log("****update user");
         respo.send("updated");
      }
    });
  });


    router.post("/updateUserName",middlewareBodyParser,function(req,respo){
      console.log("updateUserName"+req.body.name);
      var username=req.body.name;
      var user_id=req.body.user_id;
      connection.query("update users set user_name=?  where user_id=?",[username,user_id], function(err, rows) {
        if (err)
        {respo.send("error")}
         else {console.log("query is being processed *****");
           respo.send("Updated");
        }
      });
    });


      router.post("/updateUserImg",middlewareBodyParser,function(req,respo){
        console.log("updateUserImg"+req.body.user_img);
        var user_id=req.body.user_id;
        var user_img=req.body.user_img;
        connection.query("update users set   avatar_url=? where user_id=?",[user_img,user_id], function(err, rows) {
          if (err)
          {respo.send("error")}
           else {
             respo.send("Updated");
          }
        });
      });



        router.post("/updatePassword",middlewareBodyParser,function(req,respo){
          console.log("updatePassword"+req.body.old_password);
          var old_password=req.body.old_password;
          var new_password=req.body.new_password;
          var user_id=req.body.user_id;
          connection.query("update users set password=? where user_id=? and password=? ",[new_password,old_password,user_id], function(err, rows) {
            if (err)
            {respo.send("error")}
             else {
               respo.send("updated");
            }
          });
        });



});

module.exports = router;
