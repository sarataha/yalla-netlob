// config/passport.js

var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('../models/users');
var connection = mysql.createConnection(dbconfig.connection);

var configAuth = require('./auth');

 var nodemailer = require("nodemailer");
 var fs = require("fs");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "yallanetlob@gmail.com",
        pass: "yallanetlobositi"
    }
});
var rand,mailOptions,host,link;

var multer  = require('multer')
var upload = multer({ dest: '../public/assets/img/avatar/' })

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'sarazilla', 
    api_key: '621858345579474', 
    api_secret: '1rilj-EVmYy1R0YaTpFPstOEUFo' 
});

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {

    /**
     * Passport Session
     */

    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ' + user.user_id)
        if (user.id == undefined)
            done(null, user.user_id);
        else
            done(null, user.id);
    });

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
            passReqToCallback : true
        },
        function(req, email, password, done) {
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // cloudinary.uploader.upload(req.body.avatar, function(result) { 
                    //     console.log(result) 
                    // });
                    
                    console.log(req.body.avatar)
                    // fs.readFile('image.jpg', function(err, data) {
                    //     if (err) throw err;
                    //     console.log(data);
                    // });
                    var newUserMysql = {
                        email: email,
                        username: req.body.username,
                        password: bcrypt.hashSync(password, null, null),  // Sekurity :D
                        picture: req.body.avatar.value
                    };

                    var insertQuery = "INSERT INTO users ( user_name, email, password, avatar_url ) values (?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password, newUserMysql.picture],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        rand=Math.floor((Math.random() * 100) + 54);
                        host=req.get('host');
                        link="http://"+req.get('host')+"/verify?id="+rand+"&email="+newUserMysql.email;
                        mailOptions={
                            to : newUserMysql.email,
                            subject : "Please confirm your Email account",
                            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                        }
                        console.log(mailOptions);
                        smtpTransport.sendMail(mailOptions, function(error, response){
                            if(error){
                                console.log(error);
                                res.end("error");
                            } else{
                                console.log("Message sent: " + response.message);
                                return done(null, false, req.flash('signupMessage', 'verification email has been sent.'));
                                // return response.render('send.ejs');
                                // res.end("sent");
                            }
                        });

                        return done(null, false, req.flash('signupMessage', 'verification email has been sent.'));

                        // rand=Math.floor((Math.random() * 100) + 54);
                        // host=req.get('host');
                        // link="http://"+req.get('host')+"/verify?id="+rand+"&email="+newUserMysql.email;
                        // mailOptions={
                        //     to : newUserMysql.email,
                        //     subject : "Please confirm your Email account",
                        //     html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                        // }
                        // console.log(mailOptions);
                        // smtpTransport.sendMail(mailOptions, function(error, response){
                        //     if(error){
                        //         console.log(error);
                        //         res.end("error");
                        //     } else{
                        //         console.log("Message sent: " + response.message);
                        //         return done(null, false, req.flash('signupMessage', 'verification email has been sent.'));
                        //         // return response.render('send.ejs');
                        //         // res.end("sent");
                        //     }
                        // });

                        // return done(null, true);

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
            connection.query("SELECT * FROM users WHERE email = ? AND verified",[email,1], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password. Please try again'));

                return done(null, rows[0]);
            });
        })
    );

    /**
     * Facebook Login/Signup.
     */

    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.profileFields
    },

    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            connection.query("SELECT * FROM users WHERE facebook_id = ?",[profile.id], function(err, rows) {
                console.log(profile);
                if (err)
                    return done(err);

                if (rows[0]) {
                    return done(null, rows[0]);
                } else {
                    var newUserMysql = {
                        facebook_id: profile.id,
                        facebook_token: token,
                        username: profile.name.givenName + ' ' + profile.name.familyName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : ''
                    };

                    var insertQuery = "INSERT INTO users ( user_name, email, facebook_token, facebook_id, avatar_url ) values (?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.facebook_token, newUserMysql.facebook_id, newUserMysql.picture],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }

            });
        });

    }));

    /**
     * TWITTER Login/Signup.
     */

    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },

    function(token, tokenSecret, profile, done) {

        process.nextTick(function() {
            connection.query("SELECT * FROM users WHERE twitter_id = ?",[profile.id], function(err, rows) {

                if (err)
                    return done(err);

                if (rows[0]) {
                    return done(null, rows[0]);
                }
                else {
                    var newUserMysql = {
                        twitter_id: profile.id,
                        twitter_token: token,
                        username: profile.username,
                        picture: profile.photos ? profile.photos[0].value : ''
                    };

                    var insertQuery = "INSERT INTO users ( user_name, twitter_token, twitter_id, avatar_url ) values (?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.twitter_token, newUserMysql.twitter_id, newUserMysql.picture],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });

        });

    }));

    /**
     * GOOGLE Login/Signup.
     */

    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            connection.query("SELECT * FROM users WHERE google_id = ?",[profile.id], function(err, rows) {

                if (err)
                    return done(err);

                if (rows[0]) {

                    return done(null, rows[0]);

                }

                else {
                    var newUserMysql = {
                        google_id: profile.id,
                        google_token: token,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        picture: profile.photos ? profile.photos[0].value : ''
                    };

                    var insertQuery = "INSERT INTO users ( user_name, email, google_token, google_id, avatar_url ) values (?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.google_token, newUserMysql.google_id, newUserMysql.picture],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        });

    }));
};
