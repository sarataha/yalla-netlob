// routes/index.js
module.exports = function(app, passport) {

	/* GET Home page with login form. */
	app.get('/', function(req, res) {
		// Redirect user to the dashboard if he trys to open the login page while already logged in
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name
			});
		}
		else {
		res.render('login.ejs', { message: req.flash('loginMessage') });
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
				username: req.user.user_name
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
			username: req.user.user_name
		});
	});

	/* GET groups page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/groups', isLoggedIn, function(req, res) {
		res.render('groups.ejs', {
			title: 'Groups',
			username: req.user.user_name
		});
	});

	/* GET home friends if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/friends', isLoggedIn, function(req, res) {
		res.render('friends.ejs', {
			title: 'Friends',
			username: req.user.user_name
		});
	});

	/* GET home orders if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/orders', isLoggedIn, function(req, res) {
		res.render('orders.ejs', {
			title: 'Orders',
			username: req.user.user_name
		});
	});

	/* GET new order page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/orders/new_order', isLoggedIn, function(req, res, next) {
	  res.render('new_order', {
	  	title: 'New Order',
		username: req.user.user_name
	  });
	});

	/* GET order details page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/orders/order_details', isLoggedIn, function(req, res, next) {
	  res.render('order_details', {
	  	title: 'Order Details',
		username: req.user.user_name
	  });
	});

	/* GET current user's page if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	// TODO: add ability to view other users' profiles
	app.get('/user', function(req, res, next) {
	  res.render('profile', {
	  	title: 'Profile',
	  	username: req.user.user_name
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