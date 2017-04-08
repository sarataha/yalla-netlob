var express = require('express');

// set up
// get all the tools we need
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration

require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
  secret: 'twinkletwinklelittlestarhowiwonderwhatyouare',
  resave: true,
  saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./routes/index.js')(app, passport);

var index = require('./routes/index');
var users = require('./routes/users');
var friends = require('./routes/friends');
var groups = require('./routes/groups');
var orders = require('./routes/orders');
var new_order = require('./routes/new_order');
var order_details = require('./routes/order_details');

app.use('/home', index);
app.use('/users', users);
app.use('/groups', groups);
app.use('/friends', friends);
app.use('/orders', orders);
app.use('/new_order', new_order);
app.use('/order_details', order_details);

// catch 404 error and forward error status handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, error only being provided in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(8090,function () {
  console.log("Server started....");
});
