// config/passport.js

// Load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

// Load the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../models/users');
var connection = mysql.createConnection(dbconfig.connection);

// load the auth variables
var configAuth = require('./auth');

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

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.profileFields
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            connection.query("SELECT * FROM users WHERE facebook_id = ?",[profile.id], function(err, rows) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (rows[0]) {
                    return done(null, rows[0]); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    // var newUser            = new User();
                    var newUserMysql = {
                        facebook_id: profile.id,
                        facebook_token: token,
                        username: profile.name.givenName + ' ' + profile.name.familyName,
                        email: profile.emails[0].value
                    };

                    var insertQuery = "INSERT INTO users ( user_name, email, facebook_token, facebook_id ) values (?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.facebook_token, newUserMysql.facebook_id],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }

            });
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {
            connection.query("SELECT * FROM users WHERE twitter_id = ?",[profile.id], function(err, rows) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (rows[0]) {
                    return done(null, rows[0]); // user found, return that user
                }
                else {
                    // if there is no user found with that facebook id, create them
                    // var newUser            = new User();
                    var newUserMysql = {
                        twitter_id: profile.id,
                        twitter_token: token,
                        username: profile.username
                    };

                    console.log(profile.username);

                    var insertQuery = "INSERT INTO users ( user_name, twitter_token, twitter_id ) values (?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.twitter_token, newUserMysql.twitter_id],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });

        });

    }));
};