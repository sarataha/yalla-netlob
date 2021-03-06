// routes/index.js
var mysql=require('mysql');

var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var dbconfig = require('../models/groups');

//var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});
module.exports = function(app, passport) {

	/* GET Home page with login form. */
	app.get('/', function(req, res) {
		// Redirect user to the dashboard if he trys to open the login page while already logged in
		if (req.isAuthenticated()) {
			var user_id=req.user.user_id;
			connection.query("select users.user_name,orders.* from users,orders where user_id=owner_id limit 5;SELECT * from notifications",function (err,row) {
				if(err)
					console.log(err);
				else {
					if(row) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id,
				avatar: req.user.avatar_url,
				data:row[0],
				row:row[1],
				cls: ["active","inactive","inactive","inactive"]
			});
		}
		else {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id,
				avatar: req.user.avatar_url,
				row:[]
			});
		}
		}
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

	app.get('/verify',function(req,res){
		console.log(req.protocol+":/"+req.get('host'));
		    console.log("Domain is matched. Information is from Authentic email");

		    	var connection = mysql.createConnection({
			  		host     : 'localhost',
			  		user     : 'root',
			  		password : '',
			  		database : 'yala_netlob_development'
				});

		    	connection.query("UPDATE users SET verified = ? WHERE email = ?",[1,req.query.email],function(err) {
		    		if (err) {
		    			console.log(err);
		    		}
		    		else {
		    			console.log("done");
		    		}
		    	})

		        console.log("email is verified");
		        res.end("<h1>Email "+req.query.email+" is been Successfully verified</h1><p>Visit the <a href='/'>Login</a> page to start your journey</p>");
	});

	/* GET home page if user logged in. */
	app.get('/home', isLoggedIn, function(req, res) {
		console.log(req.user.avatar_url);
		var user_id = req.user.user_id;
		var query="select users.user_name,orders.* from users,orders where user_id=owner_id limit 5;SELECT * FROM notifications;";
		connection.query(query,[user_id],function(err,row,fields){
			if(!err){
        console.log("Hooooooooooooooooooooooooooooome");
					console.log(row[0]);
          console.log(row[1]);
					res.render('index.ejs', {
					title: 'Home',
					username: req.user.user_name,
					userID:req.user.user_id,
					avatar: req.user.avatar_url,
					data:row[0],
					row:row[1],
					cls: ["active","inactive","inactive","inactive"]
					// notifications: [{row.notifier_id: row.order_id}]
				});
			}else {
				console.log(err);
			}
		});

	});

	// app.post('/home', isLoggedIn, function(req, res) {
	//
	// });

	/* GET home friends if user logged in. */
	// requires a middleware to verify that the user is successfully logged in
	app.get('/friends', isLoggedIn, function(req, res) {
		var connection = mysql.createConnection({
  		host     : 'localhost',
  		user     : 'root',
  		password : '',
  		database : 'yala_netlob_development',
  		multipleStatements: true
	});
  connection.connect(function(err){
 		 if(err){
    		console.log("error to connect to mysql server");
    		return;
  		}else{
    		console.log("connected succesfully");
  		}
	});

	connection.query("select users.* from users where user_id in(select friend_id from user_friends where user_id="+req.user.user_id+");SELECT * FROM notifications;",function(err,rows,fields){
		// body...
		if (!err) {
			console.log("HI FROM ",rows)
			if (rows.length>0) {
				console.log(rows);
				res.render('friends.ejs', {
				title: 'Friends',
				username: req.user.user_name,
				userID:req.user.user_id,
				friends:rows[0],
				avatar: req.user.avatar_url,
				row:rows[1],
				usersdata:rows[0],
				cls: ["inactive","active","inactive","inactive"]
				});

			}
			else{
				connection.query("SELECT * FROM notifications",function (err,row) {
					if (err) {
						console.log(err);
					}
					else {
						if(row) {
						res.render('friends.ejs', {
							title: 'Friends',
							username: req.user.user_name,
							friends: [],
							userID:req.user.user_id,
							avatar: req.user.avatar_url,
							row:row,
							cls: ["inactive","active","inactive","inactive"]
						});
					}
					else{
						res.render('friends.ejs', {
							title: 'Friends',
							username: req.user.user_name,
							friends: [],
							userID:req.user.user_id,
							avatar: req.user.avatar_url,
							row:[],
							cls: ["inactive","active","inactive","inactive"]
						});
					}
					}
				});

			}

		}else{
			console.log("error");
		}

	});

	});

	/* GET new order page if user logged in. */
	// app.get('/new_order', isLoggedIn, function(req, res, next) {
	//   res.render('new_order', {
	//   	title: 'New Order',
	// 	username: req.user.user_name,
	// 	userID:req.user.user_id,
	// 	avatar: req.user.avatar_url
	//   });
	// });

	/***
	 * FACEBOOK Authentication
	 */

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    /***
	 * TWITTER Authentication
	 */

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    /***
	 * GOOGLE Authentication
	 */

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/home',
                    failureRedirect : '/'
            }));

    /***
     * RESET PASSWORD
     */

	app.get('/reset', function (req, res, next) {
		if (req.isAuthenticated()) {
			res.render('index.ejs', {
				title: 'Home',
				username: req.user.user_name,
				userID:req.user.user_id,
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
    		to: 'yallanetlob@yahoo.com', // receiver address
    		subject: 'Your New Password', // Subject line
    		text: 'Dear Customer,\n This is your new password', // plain text body
    		html: '<p>Dear Customer, <br> You have requested to reset your password. <br> Your new passwo</p>' // html body
	    }
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
