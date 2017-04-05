// ./models/users.js

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development'
});

connection.connect();

// for login
var find_user = function(email,password) {
  var query = "SELECT * FROM users WHERE email ='" + email + "' AND password='"+password+"'"
  connection.query(query, function(err, rows, fields) {
    if(!err)
      if (rows.length > 0)
        console.log('User found: ', rows);
      else
        console.log('invalid user data');
    else
      console.log("");
  });
}

// for registeration
var insert_user = function(username, email, password, avatar_url) {
 var check_if_user_exists = find_user(email, password);
 if (check_if_user_exists) {
   console.log('user already exists');
 }
 else {
   var user = {
         email: "sara@sara.com",
         password: "whatever",
         avatar_url: ""
     };
   var query = "INSERT INTO users SET ?";
   connection.query(query, user, function(err, result) {
     if (err)
       console.log(err);
     else
       console.log(result);
   });
 }
}

// find user's friends
var find_friends = function() {

}

// test connection
connection.query('SELECT * from users WHERE email = "Jonas8@example.org"', function(err, rows, fields) {
  if (!err)
    if (rows.length > 0)
      console.log('User found: ', rows[0].user_name);
  else
    console.log('no user found');
  else
    console.log('Error while performing Query.');
});

connection.end();