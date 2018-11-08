
var http              = require('http');
var MongoClient       = require('mongodb').MongoClient;
var randomString      = require('random-string');
var url               = "mongodb://localhost:27017/";
var express           = require( "express" );


var database_object;
var database_coupons_object; 
var database_name;
var db_coupon_collection;



 module.exports.create_connection =  function create_connnect_with_mongo( db_name , db_collection )
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    database_object = db.db( db_name );
    database_object.createCollection( db_collection , function(err, res) {
    });
    database_name         = db_name;
    db_coupon_collection  = db_collection;
  });
}

module.exports.save_generated_coupons =  function save_generated_coupons( coupons )
{  
  database_object.collection( db_coupon_collection ).insertMany( coupons , function(err, res) {
      if (err) throw err;  
    });
}

module.exports.get_all_coupons =  function get_all_coupons( ws )
{  
  database_object.collection( db_coupon_collection ).find({}).limit( 500 ).toArray(function(err, all_coupons) {
    if (err) throw err;  

    var output = "";
    
 
    all_coupons.forEach(function(element) {
      output += element.name + "<br>";
      });
      ws.send(JSON.stringify({
        mode : 'redeem',
        status : '200' ,
        response : output
      }));

  });
}

module.exports.get_all_specefic_coupons =  function get_all_specefic_coupons( number_of_coupons  )
{  
  database_object.collection( db_coupon_collection ).find({}).limit( number_of_coupons ).toArray(function(err, all_coupons) {
    if (err) throw err;
    return all_coupons;
  });
}

module.exports.delete_coupon =  function delete_coupon( delete_coupon  )
{
  database_object.collection("Coupons").find(delete_coupon).toArray(function(err, result) {
    if (err) throw err;
    if( result.length > 0 )
    {
      database_object.collection( db_coupon_collection ).deleteOne(delete_coupon, function(err, obj) {
        if (err) throw err;
      })
    }  
 
 

});
}