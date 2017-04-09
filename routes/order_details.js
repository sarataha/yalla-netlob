var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
	// body...
	res.render('order_details.ejs',{
		title: "Order Details",
		username: req.user.user_name,
		userID: req.user.user_id
	});
});

module.exports = router;