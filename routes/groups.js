var express = require('express');
var mysql=require('mysql');
var router = express.Router();
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');
var connection = mysql.createConnection(dbconfig.connection);
router.use(function(req,resp,next){
  resp.setHeader("Access-Control-Allow-Origin","*");
  resp.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next()
})
connection.query('USE ' + dbconfig.database);

router.post("/add",middlewareBodyParser,function(req,respo){
  console.log("groupnameee"+req.body.name);
  var groupname=  req.body.name;
  var groupadmin=req.body.user_id;
  connection.query("SELECT * FROM groups WHERE group_name  = ?",groupname, function(err, rows) {
      if (err)
          return done(err);
      if (rows.length) {
        console.log("That group already exist");
          //return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
          // If no email found in the database;
          // Create that user

          var insertQuery = "INSERT INTO groups (group_name,group_admin ) values('"+groupname+"',"+user_id+")";

          connection.query(insertQuery,function(err, rows) {
              newGroupMysql.id = rows.insertId;
              return done(null, newUserMysql);
          });
      }
  });
});

module.exports = router;
