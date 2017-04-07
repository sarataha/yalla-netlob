// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('home.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
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

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('index.ejs', {
			username : req.user, // get the user out of session and pass to template
			title: 'Home',
		});
	});

	app.get('/groups', isLoggedIn, function(req, res) {
		res.render('groups.ejs', {
			username : req, // get the user out of session and pass to template
			title: 'Groups',
		});
	});

	app.get('/friends', isLoggedIn, function(req, res) {
		res.render('friends.ejs', {
			username : req.user, // get the user out of session and pass to template
			title: 'Friends',
		});
	});

	app.get('/orders', isLoggedIn, function(req, res) {
		res.render('orders.ejs', {
			username : req.user, // get the user out of session and pass to template
			title: 'Orders',
		});
	});

	/* GET new order page. */
	app.get('/orders/new_order', isLoggedIn, function(req, res, next) {
	  res.render('new_order', {
	  	title: 'New Order',
	  	username: 'Sara',
	  });
	});

	/* GET order details page. */
	app.get('/orders/order_details', isLoggedIn, function(req, res, next) {
	  res.render('order_details', {
	  	title: 'Order Details',
	  	username: 'Sara'
	  });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}