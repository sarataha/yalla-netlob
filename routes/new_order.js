var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var dbconfig = require('../models/orders');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false})
var http=require('http');
connection.query('USE ' + dbconfig.database);

var mysql     = require('mysql');
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

router.get('/',isLoggedIn,function(req, res) {
    var user_id = req.user.user_id;
    var query="select * from notifications";
    connection.query(query,function(err,row,fields){
      if(!err){
          console.log(row);
          return res.render('new_order', {
          title: 'New Order',
          username: req.user.user_name,
          userID:req.user.user_id,
          avatar: req.user.avatar_url,
          row:row,
          cls: ["inactive","inactive","inactive","active"]
          // notifications: [{row.notifier_id: row.order_id}]
        });
      }else {
        console.log(err);
      }
    });
  // return res.render("new_order",{
  //       title: 'new_order',
  //       username: req.user.user_name,
  //       userID: req.user.user_id,
  //       avatar: req.user.avatar_url,
  //     });
});

router.post('/',middlewareBodyParser,function(req, res) {
  console.log(req.body.member_type);
  console.log("user id&&&&&&&&&&&&&&&&&&&&&");
  user_id=req.user.user_id;
  if(req.body.member_type=="friend"){
    email=req.body.member_email;
    console.log(req.body.member_email);
    var member_id;
    var friend_name;
    var query="select user_id,user_name from users where email='"+email+"'";
    connection.query(query,function(err,row){
      if(!err){
        console.log("rowww emaiiiiil");
        console.log(row);
        //console.log(row[0].user_id);
        if(row.length>0){
          member_id=row[0].user_id;
          friend_name=row[0].user_name;
          console.log("Member id ###########");
          console.log(member_id);
        }
      }else {
        console.log(err);
      }
      var query="select friend_id from user_friends where user_id='"+user_id+"' and friend_id='"+member_id+"'";
      connection.query(query,function(err,row){
        if(!err){
          console.log(row);
          if(row.length>0){
            res.send({message:"is_friend",friend_name:friend_name,friend_id:member_id});
          }else{
            res.send({message:"not_friend"});
          }
        }else {
          console.log(err);
        }
      });
    });
  }
  else if(req.body.member_type=="group"){
    group_name=req.body.member_name;
    user_id=req.user.user_id;
    var group_id;
    console.log("into grooooooooooooup");
    console.log(group_name);
    console.log(user_id);
    var query="select group_id from groups where group_admin='"+user_id+"' and group_name='"+group_name+"'";
    connection.query(query,function(err,row){
      if(!err){
        console.log("grouppppppppppppppppppppppppppppppppp");
        console.log(row);
        if(row.length>0){
          group_id=row[0].group_id;
          console.log(group_id);
          var nquery="select users.user_name ,users.user_id from users,group_members where users.user_id=group_members.user_id and group_id='"+group_id+"'";
          connection.query(nquery,function(error,nrow){
            if(!error){
              console.log("group useeeeeeeeeeeeeeeeeeeeeeeers");
              console.log(nrow);
              if(nrow.length>0)
                res.send({message:"is_group",group_members:nrow});
            }else{
              console.log(error);
            }
          });

        }else{
          res.send({message:"not_group"});
        }
      }else {
        console.log(err);
      }
    });
  }

});

router.put('/',middlewareBodyParser,function(req, res) {
  console.log("**************"+req.body);
  console.log("00000000"+req.body.owner_id);
  var owner_id=req.body.owner_id;
  var meal_type=req.body.meal_type;
  var resturant=req.body.from;
  var menu_img=req.body.image;
  var owner_name = req.body.owner_name;
  var invited_id = req.body.invited_id;
  var order_name = req.body.order_name
  var invited_count=invited_id.length;
    var d= new Date();
    console.log(owner_name);
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
var order_time=year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
//var order_time ="'"+d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"'";
//  var order_time=new Date("yyyy-mm-dd").toLocaleString();
  console.log(order_time);
  connection.query("insert into orders (meal_type,order_status,owner_id,resturant,menu_img,order_time,order_name,invited_count) values (?,?,?,?,?,?,?,?)",[meal_type,"waiting",owner_id,resturant,menu_img,order_time,order_name,invited_count],function(error,row){
    if(error)
    {
      console.log(error);
    }
    else{
      console.log("inersted");

      connection.query("select order_id from orders where owner_id=? and order_time=?",[owner_id,order_time],function(error,rows){
        if(error){
          console.log(error);
        }else{
          console.log(rows[0].order_id);


                  connection.query("select order_id from orders where owner_id=? and order_time=?",[owner_id,order_time],function(error,rows){
                    if(error){
                      console.log(err);
                    }else{
                      console.log(owner_name);

                        console.log("ay 7aga blelskdnasjkdakjsdkjakj");
                        for(var i=0;i<req.body.invited_id.length;i++){
                          console.log(req.body.invited_id[i]);
                      connection.query("INSERT INTO notifications (notifier_id, notified_id, order_id, notifier_name, type, order_name) values(?,?,?,?,?,?)",[owner_id,invited_id[i],rows[0].order_id,owner_name,0,req.body.order_name],function (err,rows) {
                        if (err) {
                          console.log(err);
                        }
                      else {

                      }
                    });
                  }
                  res.send("notify")
                  }
                  });
        }
      });
    }
  });
});
// route middleware to check:
function isLoggedIn(req, res, next) {

  // if the user is authenticated in the session, keep going
  if (req.isAuthenticated())
    return next();

  // else if they aren't then redirect them to the login/signup home page
  res.redirect('/');
}


module.exports = router;
