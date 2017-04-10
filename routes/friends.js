var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var bodyParser=require('body-parser');
var middlewareBodyParser=bodyParser.urlencoded({extended:false});

/* GET friends page. */
 router.get('/', function(req, res, next) {
  
});
router.post("/add",middlewareBodyParser,function(req,respo){
	
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
        			console.log("done");
        			respo.send("done you friend is added");
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


module.exports = router;
