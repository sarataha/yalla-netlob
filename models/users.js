var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development'
});

connection.connect();

exports.find_user = function() {
	var query = "SELECT * FROM users WHERE email ='" + email + "' AND password='"+password+"'"
	connection.query(query, function(err, rows, fields) {
		if(!err)
			console.log("");
		else
			console.log("");
	});
}

connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();