// config/passport.js

// Load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// Load the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../models/users');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// Share the authentication function with the rest of our app
module.exports = function(passport) {

    /**
     * Passport session setup.
     */

    // Used to serialize the user for the session, passport stuff
    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ' + user.user_id)
        if (user.id == undefined)
            done(null, user.user_id);
        else
            done(null, user.id);
    });

    // Used to deserialize the user, passport stuff
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE user_id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    /**
     * Local Signup.
     */

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // Find a user with an email similar to the email in the form
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // If no email found in the database;
                    // Create that user
                    var newUserMysql = {
                        email: email,
                        username: req.body.username,
                        password: bcrypt.hashSync(password, null, null)  // Sekurity :D
                    };

                    var insertQuery = "INSERT INTO users ( user_name, email, password ) values (?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    /**
     * Local Login.
     */

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
        // Callback with email and password from the login form
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // If the entered password is incorrect
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password. Please try again'));

                // Everything is fine? Return successful and log the user in
                return done(null, rows[0]);
            });
        })
    );
};