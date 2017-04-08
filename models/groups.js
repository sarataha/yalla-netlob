// model groups
var mysql=require('mysql');

//initialize the connecting to mysql
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': ''
    },
  'database': 'yala_netlob_development',
    'groups_table': 'groups'
};
//connnecting to mysql
// connection.connect(function(err){
//   if(err){
//     console.log("error to connect to mysql server");
//     return;
//   }else{
//     console.log("connected succesfully");
//   }
// });

// //create group
// var create_group=function(group_name,group_admin){
//   var group={
//     group_name:"OS",
//     group_admin:"1"
//   };
//   connection.query("insert into groups set ?",group,function(err){
//     if(err){
//       console.log("the group is not created");
//     }else{
//       console.log("created successfully");
//     }
//   });
// }
// // var new_group=function(group_name,admin_id){
// //   var query="insert into groups (name,admin_id) values('"+group_name+","+admin_id"')"
// // }
//
// //insert members to group
// var add_member=function(group_id,user_id){
//   var data={
//     group_id="1",
//     user_id="2"
//   }
//   var query="insert into group_members set ?";
//   connection.query(query,data,function(err,resault){
//     if(err)
//       console.log(err);
//     else
//       console.log(resault);
//   });
// }
//
// //remove member from group
// var remove_member=function(group_id,user_id){
//   var data={
//     group_id="1",
//     user_id="2"
//   }
//   var query="delete from group_members where ?";
//   connection.query(query,data,function(err,resault){
//     if(err)
//       console.log(err);
//     else
//       console.log(resault);
//   });
// }
//
// //delete group
// var delete_group=function(group_id){
//   var query="delete from groups where group_id='"+group_id+"'";
//   connection.query(query,data,function(err,resault){
//     if(err)
//       console.log(err);
//     else
//       console.log(resault);
//   });
// }
//
// //get all user groups
// var user_groups=function(user_id){
//   var query="select group_name from groups where group_admin='"+user_id+"'";
//   connection.query(query,data,function(err,resault){
//     if(err)
//       console.log(err);
//     else
//       console.log(resault);
//   });
// }
// connection.end();
