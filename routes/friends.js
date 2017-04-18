var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false});

/* GET friends page. */
/* router.get('/', function(req, res, next) {
  var connection = mysql.createConnection({
  		host     : 'localhost',
  		user     : 'dina',
  		password : '0802',
  		database : 'yala_netlob_development'
	});
  connection.connect(function(err){
 		 if(err){
    		console.log("error to connect to mysql server");
    		return;
  		}else{
    		console.log("connected succesfully");
  		}
	});

	connection.query("select * from users where user_id in(select friend_id from user_friends where user_id="+req.user.user_id+")",function(err,rows,fields){
		// body...
		if (!err) {
			console.log(rows);
		}else{
			console.log("error");
		}

	});
}); */
router.post("/add",middlewareBodyParser,function(req,respo){

	var connection = mysql.createConnection({
  		host     : 'localhost',
  		user     : 'root',
  		password : '',
  		database : 'yala_netlob_development'
	});
	connection.connect(function(err){
 		 if(err){
    		console.log("error to connect to mysql server");
    		return;
  		}else{
    		console.log("connected succesfully");
  		}
	});
	console.log("friend" +req.body.friend_mail);
	var email=req.body.friend_mail;
	//var res=null;
	connection.query("select * from users where email='"+email+"'", function(err, rows,fields) {

    if(!err)
     { if (rows.length > 0)
        {
        	console.log('User found: ', rows[0]);
        	connection.query("insert into  user_friends( user_id ,friend_id) values(?,?)",[req.user.user_id,rows[0].user_id],function(insert_error,insert_row){
        		// body...
        		if (!insert_error) {
        			console.log("done to mylist ");
        			connection.query("insert into  user_friends( user_id ,friend_id) values(?,?)",[rows[0].user_id,req.user.user_id],function(insert_error2,insert_row2){
        				if (!insert_error2){
        					//respo.send("done you friend is added");
        					respo.redirect("/friends");
        				}
        				else{
        					respo.send("the friend is already existed");
        				}
        			});

        			
        		}
        		else{
        			console.log("the friend is already existed");
        			respo.send("the friend is already existed");
        		}

        	})

        }
      else
        console.log('invalid user data');
	}
    else
      console.log("invalid data");
  });
	//console.log("result "+res);


});

router.get("/remove",function(req,resp) {
	// body...
	console.log("helllooooooooooooooo"+req.query.id);
	var connection = mysql.createConnection({
  		host     : 'localhost',
  		user     : 'root',
  		password : '',
  		database : 'yala_netlob_development'
	});
	connection.query("delete  from user_friends WHERE user_id= ? and friend_id=?",[req.user.user_id,req.query.id], function(err, rows) {
    if (err)
    {resp.send("error")}
     else {
     	connection.query("delete  from user_friends WHERE user_id= ? and friend_id=?",[req.query.id,req.user.user_id], function(err2, rows2) {
       		if (err2) {
       			resp.send("error");
       		}else{
       			//resp.send("delete");
       			resp.redirect("/friends");

       		}
   });

    }
  });
	
})
module.exports = router;
