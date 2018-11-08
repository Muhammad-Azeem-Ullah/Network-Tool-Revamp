
var http              = require('http');
var MongoClient       = require('mongodb').MongoClient;
var randomString      = require('random-string');
var url               = "mongodb://localhost:27017/";
const controller_mongo   = require("./mongo-controller.js");
const controller_generate_coupon = require("./generate-coupon-controller.js");

const WebSocket       = require('ws');
var express           = require( "express" );


function full_async( coupon_count,  ws , callback ){
  
    callback( coupon_count );

}

module.exports.generate_coupon  = function generate_coupon( coupon_count , ws  )
{
    var coupons = [] ;
    batch_request = 10000;
    var count = 0;
    if( Number.isInteger( parseInt ( coupon_count ) )  )
    {  
      full_async( coupon_count,  ws , call_obj = function( nos_count ){

        batch_request = 10000;

        if( nos_count > batch_request ) {

          setTimeout( function() {
            for(var i = 0; i < batch_request ;i++){
              coupon =  { name: randomString() };
              coupons.push( coupon );
            }
            controller_mongo.save_generated_coupons( coupons );
            controller_generate_coupon.send_coupons_to_ws( coupons , ws );
            coupons = [];
            full_async( nos_count - batch_request , ws , call_obj );
              
            } , 10);
          }
      });
    }
    remains_coupons = coupon_count % batch_request;
    
    if( remains_coupons != 0  )
    {
      for(var i = 0; i < remains_coupons ;i++){
       
        coupon =  { name: randomString() };
        coupons.push( coupon );
        count++;
      }
      console.log( "call this" );
      controller_mongo.save_generated_coupons( coupons );
      controller_generate_coupon.send_coupons_to_ws( coupons , ws );
         
          coupons = [] ;
          count = 0 ;
    }

        
       
        console.log( "Request Complete" );
      

      return coupons;
  
}

module.exports.send_coupons_to_ws  = function send_coupons_to_ws( coupons , ws )
{
    var output            =  "";


    
    coupons.forEach(function(element) {
    output += element.name + "<br>";
    });
    ws.send(JSON.stringify({
      mode : 'generate',
      status : '200' ,
      response : output
    }));
  
}



