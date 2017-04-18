var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/groups');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');

// router.use(function(req,resp,next){
//   resp.setHeader("Access-Control-Allow-Origin","*");
//   resp.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
//   next()
// });

connection.query('USE ' + dbconfig.database);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});

connection.connect();

router.get("/",isLoggedIn,function(req,res){

  var user_id=req.user.user_id;
  console.log("*********");
  connection.query("SELECT * FROM groups where group_admin= ?;SELECT * FROM notifications;",user_id, function(err, rows) {

    if (err)
    {
      console.log(err)
    }
    else if (rows) {
      console.log("group name: "+rows[0].group_name);
      res.render('groups.ejs', {
        title: 'Groups',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
        groups: rows[0],
        row:rows[1]
      });

      //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

    } else {
      connection.query("SELECT * FROM notifications", function(err, rows) {
      if (err) {
        console.log(err);
      }
      else{
        if(rows) {
          res.render('groups.ejs', {
            title: 'Groups',
            username: req.user.user_name,
            userID: req.user.user_id,
            avatar: req.user.avatar_url,
            groups: "",
            row:rows
          });
        }
      else {
        res.render('groups.ejs', {
            title: 'Groups',
            username: req.user.user_name,
            userID: req.user.user_id,
            avatar: req.user.avatar_url,
            groups: "",
            row:[]
          });
      }
    }
    });
    }
  });
});

router.get("/group",isLoggedIn,function(req,res) {
  console.log("HIIIIIIIIIIIIIIIII");
  console.log(req.query.group);
  var group_name = req.query.group;
  console.log(group_name);
  var admin_id=req.user.user_id;
  var query = "select user_name from users where user_id in(select user_id from group_members where group_id=(select group_id from groups where group_name= ? and group_admin=?))";
  connection.query(query,[group_name,admin_id],function(err,rows) {
    if (err) {
      return done(err);
    }
    else if (rows.length>0) {
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


router.post("/removegp",middlewareBodyParser,function(req,respo){
  console.log("groupnameee"+req.body.name);
  var groupname=req.body.name;
  var group_admin=req.user.user_id;;
  connection.query("delete  from groups WHERE group_name = ? and group_admin=?",[groupname,group_admin], function(err, rows) {
    if (err)
    {respo.send("error")}
     else {
       respo.send("deleted");
    }
  });
});

router.post("/removefriend",middlewareBodyParser,function(req,respo){
  console.log("friendName from remove friend"+req.body.name);
  var friendName=req.body.name;
  var groupname=req.body.groupname;
  var group_admin=req.user.user_id;;
  connection.query("delete  from group_members WHERE group_id = (select group_id from groups where group_name=? and group_admin=?) and user_id=(select user_id from users where user_name=?)",[groupname,group_admin,friendName], function(err, rows) {
    if (err)
    {respo.send("error")}
     else {
       respo.send("deleted");
    }
  });
});


router.post("/getFriends",middlewareBodyParser,function(req,respo){
  console.log("****function get friends");
  console.log("group name"+req.body.groupname);
  var user_id=req.user.user_id;
  var groupname=req.body.groupname;
  connection.query("select user_name from users WHERE user_id in( select user_id from group_members where group_id=(select group_id from groups where group_name= ? and group_admin= ?))  ",[groupname,user_id], function(err, rows) {
    if (err)
    {respo.send("error")}
    if (rows.length){
       respo.send({message:"friends",rows:rows});
    }
    else{
      respo.send({message:"no-friends"});
    }
  });
});

router.post("/getGroups",middlewareBodyParser,function(req,respo){
  console.log("****function get groups");

  var user_id=req.user.user_id;
  connection.query("select * from groups WHERE group_admin=?  ",user_id, function(err, rows) {
    if (err)
    {respo.send("error")}
    if (rows.length){
       respo.send({message:"groups",rows:rows});
    }
    else{
      respo.send({message:"no-groups"});
    }
  });
});


router.post("/addfriend",middlewareBodyParser,function(req,respo){
  console.log("user_id : "+req.body.user_id);
  console.log("friend name : "+req.body.name);
  console.log("group name : "+req.body.groupname);
  var user_ID=req.user.user_id;
  var friendname=req.body.name;
  var groupname=req.body.groupname;
  var group_id;
  connection.query("SELECT group_id FROM groups WHERE group_name = ? and group_admin=?",[groupname,user_ID], function(err, rows){
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
    var groupadmin=req.user.user_id;
    connection.query("SELECT * FROM groups WHERE group_name = ? and  group_admin= ?",[groupname,groupadmin], function(err, rows) {
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

// route middleware to check:
function isLoggedIn(req, res, next) {

  // if the user is authenticated in the session, keep going
  if (req.isAuthenticated())
    return next();

  // else if they aren't then redirect them to the login/signup home page
  res.redirect('/');
}

  module.exports = router;
