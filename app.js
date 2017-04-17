var express = require('express');

// set up
// get all the tools we need
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
// for password reset
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var path = require('path');
var app      = express();
// var http=require('http').createServer(app);
//var server=http;
// var io = require('socket.io')(http);
// http.listen(8090,"127.0.0.1");

var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

var port     = process.env.PORT || 8090;

var passport = require('passport');
var config = require('./config/auth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;

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
var profile = require('./routes/profile');

app.use('/user',profile);
app.use('/home', index);
app.use('/users', users);
app.use('/groups', groups);
app.use('/friends', friends);
app.use('/orders', orders);
app.use('/new_order', new_order);
app.use('/order_details', order_details);

// users = []
// console.log(users.length);

var currentConnections = [];

io.on('connection', function(socket){
  console.log(socket.id);
  currentConnections.push({socket: socket.id});
  console.log(currentConnections);
  socket.on('join',function(data){
      console.log("join***"+data.user_id);
      currentConnections[currentConnections.length-1].user_id = data.user_id; 
      console.log(currentConnections);
      // console.log(currentConnections[socket.id]);
      // users[data.user_id]=socket;
      // console.log("USERS LENGTH => ", users.length);
      // console.log(users[data.user_id]);
  });
  socket.on('send notification',function(data){
    console.log("in notification send");
    console.log(data.user_id);
    for (var i = currentConnections.length - 1; i >= 0; i--) {
      if(currentConnections[i].user_id == data.user_id) {
        console.log(currentConnections[i]);
        socket.broadcast.to(currentConnections[i].socket).emit('notification',data.msg);
      }
    }
    
    //users[data.user_id].emit('notification',data.msg);
  });
  console.log('connection')
//   socket.on('connection', function(msg){console.log("message recieved"+msg);});
//   socket.on('disconnect',function(){});
  socket.on('groups', function (data) {
    // body...
    console.log("GROUPS")
  });

  socket.on('disconnect', function() {
    delete currentConnections[socket.id];
  });
});


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

app.listen(port,function () {
  console.log("App is running on port " + port);
});
