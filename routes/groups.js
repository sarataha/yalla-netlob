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

router.get(["/","/group"],function(req,res){
  var groupname=  req.query.group_name|| " ";
  console.log("*********");

  connection.query("SELECT * FROM groups ", function(err, rows) {
      console.log(groupname);
      if (err)
          return done(err);
      if (rows.length) {

        console.log("group name: "+rows[0].group_name);
        res.render('groups.ejs', {
              title: 'Groups',
              username: req.user.user_name,
              userID: req.user.user_id,
              groups:rows,
              admin:groupname
            });

        //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

      } else {


      }
  });
});


router.get("/group",middlewareBodyParser,function(req,res){

  var groupname=  req.query.group_name;
  console.log("in div group" +groupname);
  connection.query("SELECT * FROM groups where group_name=?",groupname, function(err, rows) {

      if (err)
          return done(err);
      if (rows.length) {
        console.log(groupname);
        res.render('groups.ejs', {
              title: 'Groups',
              username: req.user.user_name,
              admin:rows[0].admin_id,
              userID: req.user.user_id,
              groups:rows

            });

        //  $("#groupsNames").innerHTML+="<li>'"+rows[i].group_name+"'</li>";

      } else {


      }
  });
});

router.post("/add",middlewareBodyParser,function(req,respo){
  console.log("groupnameee"+req.body.name);
  console.log("groupnameee"+req.body.name);
  var groupname=  req.body.name;
  var groupadmin=req.body.user_id;
  connection.query("SELECT * FROM groups WHERE group_name  = ?",groupname, function(err, rows) {
    console.log("HELLO==========================", groupname, groupadmin);
      if (err)
          return done(err);
      if (rows.length) {
        console.log("That group already exist");
      } else {

          var newGroupMysql = {
            groupname: req.body.name,
            groupadmin: req.body.user_id,
          };

          var insertQuery = "INSERT INTO groups ( group_name, group_admin ) values (?,?)";

          connection.query(insertQuery,[groupname,groupadmin],function(err, rows) {
              //newGroupMysql.id = rows.insertId;
              respo.render('groups.ejs');
              console.log("DONE");
          });
      }
  });
});

module.exports = router;
