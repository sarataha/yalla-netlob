var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/groups');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');

connection.query('USE ' + dbconfig.database);

router.get("/",function(req,res){
  console.log("*********");
  connection.query("SELECT * FROM groups ", function(err, rows) {

    if (err)
    return done(err);
    if (rows.length) {
      console.log("group name: "+rows[0].group_name);
      res.render('groups.ejs', {
        title: 'Groups',
        username: req.user.user_name,
        userID: req.user.user_id,
        groups: rows
      });

      //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

    } else {


    }
  });
});

router.get("/group",function(req,res) {
  console.log("HIIIIIIIIIIIIIIIII");
  console.log(req.query.group);
  var group_name = req.query.group;
  var query = "select user_name from users where user_id in(select user_id from group_members where group_id=(select group_id from groups where group_name= ?))";
  connection.query(query,group_name,function(err,rows) {
    if (err) {
      return done(err);
    }
    else if (rows.length) {
      console.log("FOUND");

      console.log(rows[0].user_name);
      res.send({message:"friends",group_name:group_name,row:rows});

    }
    else
    {
      res.send({message:"no-friends",group_name:group_name})
    }
  });
});


router.post("/addfriend",middlewareBodyParser,function(req,respo){
  console.log("user_id : "+req.body.user_id);
  console.log("friend name : "+req.body.name);
  console.log("group name : "+req.body.groupname);
  var user_ID=req.body.user_id;
  var friendname=req.body.name;
  var groupname=req.body.groupname;
  var group_id;
  connection.query("SELECT group_id FROM groups WHERE group_name = ?",groupname, function(err, rows){
    if(err){
      console.log("no group with such name");
    }
    else if (rows.length){
      console.log(" group_id: "+rows[0].group_id);
       group_id=rows[0].group_id;
    }
    else
    {console.log("NO group with such name **");}
  });

  connection.query("select * from user_friends where user_id=? and friend_id=(select user_id from users where user_name= ?)",[user_ID,friendname],function(err, rows) {
    if (err)
    console.log("Error in selecting user_friends");
    if (rows.length) {
      console.log("found some users");
      for(var i=0;i<rows.length;i++)
      {
        console.log("friend id : "+rows[i].friend_id);
        connection.query("INSERT INTO group_members ( group_id, user_id ) values (?,?)",[group_id,rows[i].friend_id],function(err, rows) {
          if (err)
          console.log("Error in insert  friend query in groups");
          else{
            console.log("friend inserted in group");
          }
          //newGroupMysql.id = rows.insertId;
        });
      }
      respo.send({message:"added"})
    } else {
      respo.send({message:"not-friend"})
    }

  });

  });


  router.post("/add",middlewareBodyParser,function(req,respo){
    console.log("groupnameee"+req.body.name);
    console.log("groupnameee"+req.body.name);
    var groupname=  req.body.name;
    var groupadmin=req.body.user_id;
    connection.query("SELECT * FROM groups WHERE group_name = ?",groupname, function(err, rows) {
      console.log("HELLO==========================", groupname, groupadmin);
      if (err)
      return done(err);
      if (rows.length) {
        respo.send("Exists");
        console.log("That group already exist");
      } else {

        var newGroupMysql = {
          groupname: req.body.name,
          groupadmin: req.body.user_id
        };

        var insertQuery = "INSERT INTO groups ( group_name, group_admin ) values (?,?)";

        connection.query(insertQuery,[groupname,groupadmin],function(err, rows) {
          //newGroupMysql.id = rows.insertId;
          respo.send("Success");
          console.log("DONE");
        });
      }
    });
  });

  module.exports = router;
