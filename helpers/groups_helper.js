var mysql=require('mysql');
var router = require('express').Router();
var dbconfig = require('../models/groups');
var connection = mysql.createConnection(dbconfig.connection);

var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');

module.exports = function() {
	connection.query("SELECT * FROM groups", function(err, rows) {
		if (err) {
			return err;
		}
		else {
			return rows;
		}
	}
};
