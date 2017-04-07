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