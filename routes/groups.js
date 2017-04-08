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

              console.log("DONE");
          });
      }
  });
});

module.exports = router;
