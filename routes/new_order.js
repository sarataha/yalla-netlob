var express = require('express');
var router = express.Router();
var mysql=require('mysql');
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
  database : 'yala_netlob_development'
});

connection.connect();

router.get('/',middlewareBodyParser,function(req, res) {
  return res.render("new_order",{
        title: 'new_order',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
      });
});

router.post('/',middlewareBodyParser,function(req, res) {
  console.log(req.body.member_type);
  console.log("user id&&&&&&&&&&&&&&&&&&&&&");
  user_id=req.user.user_id;
  if(req.body.member_type=="friend"){
    email=req.body.member_email;
    console.log(req.body.member_email);
    var member_id;
    var friend_name;
    var query="select user_id,user_name from users where email='"+email+"'";
    connection.query(query,function(err,row){
      if(!err){
        console.log("rowww emaiiiiil");
        console.log(row);
        //console.log(row[0].user_id);
        if(row.length>0){
          member_id=row[0].user_id;
          friend_name=row[0].user_name;
          console.log("Member id ###########");
          console.log(member_id);
        }
      }else {
        console.log(err);
      }
      var query="select friend_id from user_friends where user_id='"+user_id+"' and friend_id='"+member_id+"'";
      connection.query(query,function(err,row){
        if(!err){
          console.log(row);
          if(row.length>0){
            res.send({message:"is_friend",friend_name:friend_name,friend_id:member_id});
          }else{
            res.send({message:"not_friend"});
          }
        }else {
          console.log(err);
        }
      });
    });
  }
  else if(req.body.member_type=="group"){
    group_name=req.body.member_name;
    user_id=req.user.user_id;
    var group_id;
    console.log("into grooooooooooooup");
    console.log(group_name);
    console.log(user_id);
    var query="select group_id from groups where group_admin='"+user_id+"' and group_name='"+group_name+"'";
    connection.query(query,function(err,row){
      if(!err){
        console.log(row);
        if(row.length>0){
          group_id=row[0].group_id;
          console.log(group_id);
          var nquery="select users.user_name ,users.user_id from users,group_members where users.user_id=group_members.user_id and group_id='"+group_id+"'";
          connection.query(nquery,function(error,nrow){
            if(!error){
              console.log(nrow);
              if(nrow.length>0)
                res.send({message:"is_group",group_members:nrow});
            }else{
              console.log(error);
            }
          });

        }else{
          res.send({message:"not_group"});
        }
      }else {
        console.log(err);
      }
    });
  }

});


module.exports = router;
