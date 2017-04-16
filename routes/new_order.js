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
  database : 'yala_netlob_development'
});

connection.connect();

router.get('/',middlewareBodyParser,function(req, res) {
  return res.render("new_order",{
        title: 'new_order',
        username: req.user.user_name,
        userID: req.user.user_id,
        avatar: req.user.avatar_url,
      });
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
        console.log(row);
        if(row.length>0){
          group_id=row[0].group_id;
          console.log(group_id);
          var nquery="select users.user_name ,users.user_id from users,group_members where users.user_id=group_members.user_id and group_id='"+group_id+"'";
          connection.query(nquery,function(error,nrow){
            if(!error){
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
  console.log(req.body);
  console.log(req.body.owner_id);
  var owner_id=req.body.owner_id;
  var meal_type=req.body.meal_type;
  var resturant=req.body.from;
  var menu_img=req.body.image;
    var d= new Date();
var order_time ="'"+d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"'";
//  var order_time=new Date("yyyy-mm-dd").toLocaleString();
  console.log(order_time);
  connection.query("insert into orders (meal_type,order_status,owner_id,resturant,menu_img,order_time) values (?,?,?,?,?,?)",[meal_type,"waiting",owner_id,resturant,menu_img,order_time],function(error,row){
    if(error)
    {
      console.log("error while inserting");
    }
    else{
      console.log("inersted");
      connection.query("select order_id from orders where owner_id=? and order_time=?",[owner_id,order_time],function(error,rows){
        if(error){

        }else{
          console.log(rows[0].order_id);
          for(var i=0;i<req.body.invited_id.length;i++){
            console.log(req.body.invited_id[i]);
            connection.query("insert into orders_users (order_id,user_id) values (?,?)",[rows[0].order_id,req.body.invited_id[i]],function(error,rows){
              if(error){
                console.log("error in 2 query");

              }
              else{
              //   socket.on('send to server',function(data){
              //     //  socketId =  getSocketIdFromUserId(user_id);
              // io.to(req.body.invited_id[i]).emit('notification', 'test data');
          // })
                console.log("inserted 2");
              }
            });

          }

        }
      });




    }
  });
});


module.exports = router;
