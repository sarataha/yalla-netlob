// routes/index.js

var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');
module.exports = function(app, passport) {

	/* GET Home page with login form. */
	app.get('/', function(req, res) {
		// Redirect user to the dashboard if he trys to open the login page while already logged in
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id
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
			userID:req.user.user_id
		});
	});

	/* GET groups page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/groups', isLoggedIn, function(req, res) {
		res.render('groups.ejs', {
			title: 'Groups',
			username: req.user.user_name,
			userID:req.user.user_id
		});
	});

	/* GET home friends if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/friends', isLoggedIn, function(req, res) {
		res.render('friends.ejs', {
			title: 'Friends',
			username: req.user.user_name,
			userID:req.user.user_id
		});
	});

	/* GET home orders if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/orders', isLoggedIn, function(req, res) {
		res.render('orders.ejs', {
			title: 'Orders',
			username: req.user.user_name,
			userID:req.user.user_id
		});
	});

	/* GET new order page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/new_order', isLoggedIn, function(req, res, next) {
	  res.render('new_order', {
	  	title: 'New Order',
		username: req.user.user_name,
		userID:req.user.user_id
	  });
	});

	/* GET order details page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/order_details', isLoggedIn, function(req, res, next) {
	  res.render('order_details', {
	  	title: 'Order Details',
		username: req.user.user_name,
		userID:req.user.user_id
	  });
	});

	/* GET current user's page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	// TODO: add ability to view other users' profiles
	app.get('/user', isLoggedIn, function(req, res, next) {
	  res.render('profile', {
	  	title: 'Profile',
	  	username: req.user.user_name,
			userID:req.user.user_id
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
