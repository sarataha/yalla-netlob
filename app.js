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

var multer  = require('multer')
var upload = multer({ dest: 'public/assets/img/avatar/' })

var app = express();

var server = app.listen(process.env.PORT || 8090,function () {
  // body...
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
var io = require('socket.io').listen(server);

var mysql=require('mysql');
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'yala_netlob_development',
  multipleStatements: true
});

connection.connect();

// var port     = process.env.PORT || 8090;

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

var currentConnections = [];
var sockets = [];
var rooms = {};
var flag = false;

io.on('connection', function(socket){
  console.log(socket.id);
  currentConnections.push({socket: [socket.id]});
  sockets.push(socket);
  console.log(currentConnections);
  socket.on('join',function(data){
      console.log("DATA.USER_ID ", data.user_id);
      console.log("currentConnections ", currentConnections);
      
      for (var i = currentConnections.length - 1; i >= 0; i--) {
        // console.log(data.user_id);
        // console.log(currentConnections[i].user_id);

        if (currentConnections[i].user_id == data.user_id) {
          // console.log("HIIIII")
          // console.log("FLAG BEFORE CHANGE ",flag);
          // currentConnections[i].socket = socket.id;
          console.log("test ", currentConnections[i].socket.length);
          currentConnections[i].socket[currentConnections[i].socket.length] = socket.id;
          flag = true;
          // console.log("FLAG AFTER CHANGE ",flag);
          break;
        }
      }

      console.log("FLAG AFTER FOR ",flag);
      if (flag != true) {
        // console.log("INSIDE IF FLAG != TRUE. FLAG = ", flag);
        currentConnections[currentConnections.length-1].user_id = data.user_id;
      }
      console.log("join***"+data.user_id);
      flag = false;
      //currentConnections[currentConnections.length-1].user_id = data.user_id; 
      // console.log(currentConnections);
      // console.log(currentConnections[socket.id]);
      // users[data.user_id]=socket;
      // console.log("USERS LENGTH => ", users.length);
      // console.log(users[data.user_id]);
  });

  var room = "";

  socket.on('send notification',function(data){
    console.log("in notification send");
    room = data.room;
    console.log(data.owner_id);

    for (var i = currentConnections.length - 1; i >= 0; i--) {
      // for (var j = sockets.length - 1; j >= 0; j--) {
        // clients[j];
        console.log('HELLLLLLLLLLLLOOOOOOOOOOOOOOOO ITS MEEEEEEEEEEEEEEEEEEEEEEEEE\N\N\N');
        // console.log(data.user_id);
        // console.log(currentConnections[i].user_id);
        // console.log(sockets[j].id);
        if (currentConnections[i].user_id == data.owner_id) {
          console.log("HEHEHEHEHEHEHE");
          // console.log("HIIIII")
          // console.log("FLAG BEFORE CHANGE ",flag);
          // currentConnections[i].socket = socket.id;
          // console.log("BEFORE",socket.id);
          // socket.id = sockets[j].id;
          // console.log("AFTER",socket.id);
          // delete sockets[j];
          // console.log(sockets[j].id);
          // console.log(room);
          // socket.join(room);
          // console.log("FLAG AFTER CHANGE ",flag);
          rooms[data.room] = [currentConnections[i].socket];
          console.log(rooms);
          break;
        }
      // }
    }
    
    console.log("ROOOM NAAAAAAAAAME", room);
    // console.log(io.sockets.clients(room));
    // console.log(data.user_id);
    for (var i = currentConnections.length - 1; i >= 0; i--) {
      if(currentConnections[i].user_id == data.user_id) {
        console.log(currentConnections[i]);
        socket.broadcast.to(currentConnections[i].socket[currentConnections[i].socket.length - 1]).emit('notification',{owner_id:data.owner_id,msg:data.msg,room:data.room});
      }
    }

    // socket.join(room);

    // socket.on('join order', function (data) {
    //   io.sockets.in("room-"+2).emit('connectToRoom', "You are in room no. "+2);
    // });    
  });

  socket.on('join order',function (data) {
    // body...
    console.log("JOIN ROOOOOOOOOM ", data.room);
    // for (var i = currentConnections.length - 1; i >= 0; i--) {
    //   if (currentConnections[i].user_id == data.user_id) {
    //     rooms[data.room][rooms[data.room].length] = (currentConnections[i].socket);
    //     console.log(rooms);
    //     for (var i = 0; i <= rooms[data.room].length - 1; i++) {
    //       console.log(rooms[data.room][i]);
    //       socket.broadcast.to(rooms[data.room][i]).emit('notification',{msg:data.msg,room:data.room});
    //       // socket.broadcast.to(rooms[data.room][i]).emit('friend joined',{msg:'your friend has joined your order'});
    //     }
    //   }
    var owner_id = data.owner_id;
    console.log(owner_id);
    var order_name = data.room;
    var user_id = data.user_id;
    var owner_name = data.owner_name;
    var user_name = data.user_name;
    console.log("ORDER NAME ",order_name)
    connection.query("select notifications.order_id AS order_id, notifications.order_name AS order_name from orders,notifications where notifier_name=? AND notified_id=? AND type=?",[owner_name,user_id,0],function(error,rows){
        if(error){
          console.log(error);
        }else{
          console.log(rows);
          // console.log(rows[0].order_name);
          // for(var i=0;i<req.body.user_id.length;i++){
            // console.log(req.body.user_id[i]);
    connection.query("insert into orders_users (order_id,user_id) values (?,?)",[rows[0].order_id,user_id],function(error,rows){
              if(error){
                console.log("error in 2 query");

              }
              else{
                  connection.query("select owner_id, order_id, order_name from orders where owner_id=(select notifier_id from notifications where notifier_name = ? and notified_id = ? and type = ? order by order_id desc limit 1)",[owner_name,user_id,0],function(error,rows){
                    if(error){
                      console.log(error);
                    }else{
                      console.log("NOTIFY SELECT ",rows);
                      console.log(owner_name);
                      connection.query("INSERT INTO notifications (notifier_id, notified_id, order_id, notifier_name, type, order_name) values(?,?,?,?,?,?)",[user_id,rows[0].owner_id,rows[0].order_id,user_name,1,rows[0].order_name],function (err,rows) {
                        if (err) {
                          console.log(err);
                        }
                      else {
                        console.log("added");
                        console.log("TEST TEST");
                      }
                    });
                      for (var i = currentConnections.length - 1; i >= 0; i--) {
                        console.log("INSIDE for",rows[0].owner_id);
                        if(currentConnections[i].user_id == rows[0].owner_id) {
                          console.log("OWNER ID ", data.owner_id);
                          console.log(currentConnections[i]);
                          socket.broadcast.to(currentConnections[i].socket[currentConnections[i].socket.length - 1]).emit('friend joined',{user_name:data.user_name,user_id:data.user_id,owner_id:data.owner_id,msg:data.msg,room:data.room});
                        }
                      }
                    }
                  });
                }});
    }});
    
    
    // socket.join(data.room);
    // io.of('/').in(data.room).clients(function(error, clients){
    //   if (error) throw error;
    //     console.log("\n\n\n\n\n\n\nCLIENTS ",clients,"\n\n\n\n\n\n\n\n\n"); // => [Anw2LatarvGVVXEIAAAD] 
    //   });
    // console.log(io.sockets.clients(data.room));
    // io.sockets.in(data.room).emit('message', 'what is going on, party people?');
  });

  socket.on('cancel', function (data) {
    // body...
    var owner_id = data.owner_id;
    var order_id = data.order_id;
    console.log(owner_id);
    console.log(order_id);

    var query = "SELECT user_name FROM users WHERE user_id = ?;SELECT * FROM orders_users WHERE order_id = ?";
    connection.query(query,[owner_id,order_id],function (err,rows) {
      // body...
      if(err) {
        console.log(err);
      }
      else {
        if (rows[1]) {
          console.log(rows[1]);
          for (var i = rows[1].length - 1; i >= 0; i--) {
            for (var j = currentConnections.length - 1; j >= 0; j--) {
              if (rows[1][i].user_id == currentConnections[j].user_id) {
                socket.broadcast.to(currentConnections[i].socket[currentConnections[i].socket.length - 1]).emit('cancel',{owner_name:rows[0].user_name,order_id:rows[1].order_id});                
              }
            }
          }
        }
        else {
          console.log("empty")
        }
      }
    });
  });

  console.log('connection')
  socket.on('groups', function (data) {
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

// app.listen(port,function () {
//   console.log("App is running on port " + port);
// });
