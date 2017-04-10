// routes/index.js

var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');

var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

module.exports = function(app, passport) {

	/* GET Home page with login form. */
	app.get('/', function(req, res) {
		// Redirect user to the dashboard if he trys to open the login page while already logged in
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id,
				avatar: req.user.avatar_url
			});
		}
		else {
		res.render('login.ejs', {
			title: 'Login',
			message: req.flash('loginMessage')
			});
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home',
            failureRedirect : '/',
            failureFlash : true
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	/* GET signup page. */
	app.get('/signup', function(req, res) {
		// Redirect user to the dashboard if he trys to open the signup page while already logged in
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id
			});
		}
		else {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
		}
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	/* GET home page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('index.ejs', {
			title: 'Home',
			username: req.user.user_name,
			userID:req.user.user_id,
			avatar: req.user.avatar_url
		});
	});

	/* GET groups page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in

	// app.get('/groups', isLoggedIn, function(req, res) {
	// 	res.render('groups.ejs', {
	// 		title: 'Groups',
	// 		username: req.user.user_name,
	// 		userID:req.user.user_id
	// 	});
	// });
	// app.get('/groups', isLoggedIn, function(req, res) {
	// 	res.render('groups.ejs', {
	// 		title: 'Groups',
	// 		username: req.user.user_name,
	// 		userID:req.user.user_id
	// 	});
	// });

	/* GET home friends if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/friends', isLoggedIn, function(req, res) {
		res.render('friends.ejs', {
			title: 'Friends',
			username: req.user.user_name,
			userID:req.user.user_id,
			avatar: req.user.avatar_url
		});
	});

	/* GET home orders if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	/*app.get('/orders', isLoggedIn, function(req, res) {
		res.render('orders.ejs', {
			title: 'Orders',
			username: req.user.user_name,
			userID:req.user.user_id
		});
	});
*/
	/* GET new order page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/new_order', isLoggedIn, function(req, res, next) {
	  res.render('new_order', {
	  	title: 'New Order',
		username: req.user.user_name,
		userID:req.user.user_id,
		avatar: req.user.avatar_url
	  });
	});

	/* GET order details page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/order_details', isLoggedIn, function(req, res, next) {
	  res.render('order_details', {
	  	title: 'Order Details',
		username: req.user.user_name,
		userID:req.user.user_id,
		avatar: req.user.avatar_url
	  });
	});
	// app.get('/order_details', isLoggedIn, function(req, res, next) {
	//   res.render('order_details', {
	//   	title: 'Order Details',
	// 	username: req.user.user_name,
	// 	userID:req.user.user_id
	//   });
	// });

	/* GET current user's page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	// TODO: add ability to view other users' profiles
	app.get('/user', isLoggedIn, function(req, res, next) {
	  res.render('profile', {
	  	title: 'Profile',
	  	username: req.user.user_name,
			userID:req.user.user_id,
			avatar: req.user.avatar_url
	  });
	});

	/***
	 * FACEBOOK Authentication
	 */

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    /***
	 * TWITTER Authentication
	 */
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    /***
	 * GOOGLE Authentication
	 */
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/home',
                    failureRedirect : '/'
            }));

    /***
     * RESET PASSWORD
     */

    // Render reset password page
	app.get('/reset', function (req, res, next) {
	    // Redirect user to the dashboard if he trys to open the login page while already logged in
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id,
				avatar: req.user.avatar_url
			});
		}
		else {
		res.render('reset.ejs', {
			title: 'Password Reset'
			});
		}
	});

	// Process password reset
	// TODO: get email address from user
	// TODO: check if email address exists in db
	// TODO: if email exists send a reset password mail
	// TODO: if it doesn't exist return an error to user

	// app.post('/reset', function (req, res, next) {
	//     var transporter = nodemailer.createTransport({
	//         service: 'gmail',
	//         auth: {
	//             user: 'yallanetlob@gmail.com',
	//             pass: 'yallanetlobositi'
	//         }
	//     });
	//     var mailOption = {
	//         from: '"Yalla Netlob" <yallanetlob@gmail.com>', // sender address
  //   		to: 'yallanetlob@gmail.com', // receiver address
  //   		subject: 'Your New Password', // Subject line
  //   		text: 'Dear Customer,\n This is your new password', // plain text body
  //   		html: '<b>Your new password ?</b>' // html body
	//     }
	//     transporter.sendMail(mailOption, function (err, info) {
	//         if (err) {
	//             console.log(err);
	//             res.redirect('/');
	//         }
	//         else {
	//             console.log('Message %s sent: %s', info.messageId, info.response);
	//             res.redirect('/');
	//         }
	//     });
	// });

	app.post('/reset', function (req, res, next) {
	    var transporter = nodemailer.createTransport({
	        service: 'gmail',
	        auth: {
	            user: 'yallanetlob@gmail.com',
	            pass: 'yallanetlobositi'
	        }
	    });
	    var mailOption = {
	        from: '"Yalla Netlob" <yallanetlob@gmail.com>', // sender address
    		to: req.body.email, // receiver address
    		subject: 'Your New Password', // Subject line
    		text: 'Dear Customer,\n This is your new password', // plain text body
    		html: '<p>Dear Customer, <br> You have requested to reset your password. <br> Your new passwo</p>' // html body
	    }
	    console.log(req.body);
	    transporter.sendMail(mailOption, function (err, info) {
	        if (err) {
	            console.log(err);
	            res.redirect('/');
	        }
	        else {
	            console.log('Message %s sent: %s', info.messageId, info.response);
	            res.redirect('/');
	        }
	    });
	});

	/* GET logout page if user logged in. */
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to check:
function isLoggedIn(req, res, next) {

	// if the user is authenticated in the session, keep going
	if (req.isAuthenticated())
		return next();

	// else if they aren't then redirect them to the login/signup home page
	res.redirect('/');
}
