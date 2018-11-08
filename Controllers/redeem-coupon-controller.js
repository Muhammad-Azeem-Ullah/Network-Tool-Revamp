
var http                 = require('http');
var MongoClient          = require('mongodb').MongoClient;
var randomString         = require('random-string');
var url                  = "mongodb://localhost:27017/";
const controller_mongo   = require("./mongo-controller.js");
const controller_generate_coupon = require("./generate-coupon-controller.js");



const WebSocket          = require('ws');
var express              = require( "express" );





module.exports.redeem_coupon = function redeem_coupon( coupon_to_redeem , ws )
{
    var coupon = {
      name : coupon_to_redeem
    };
    const redeem_promise = new Promise(function(resolve, reject) {

        try
        {

            controller_mongo.delete_coupon( coupon );
            resolve('fine');
        }
        catch(ex)
        {
            reject('error1');
      
        }
      });
    redeem_promise
        .then(function whenOk(response) {

            controller_mongo.get_all_coupons(  ws );
           
        })
        .catch(function notOk(err) {
         console.error(err)
        });
  

    
    /*
    dbo.collection("Coupons").find(coupon).toArray(function(err, result) {
      if (err) throw err;
      if( result.length > 0 )
      {
        dbo.collection("Coupons").deleteOne(coupon, function(err, obj) {
          dbo.collection("Coupons").find({}).toArray(function(err, all_coupons) {
            if (err) throw err;
            output += coupon_to_redeem + " has been redeemed <br>";
            all_coupons.forEach(function(element) {
              output += element.name + "<br>";
              });
              ws.send(JSON.stringify({
                mode : 'redeem',
                status : '200' ,
                response : output
              }));
           
          });
        });
       
      }
      else
      {
        output += "Invalid Coupon.Try Again";
        ws.send(JSON.stringify({
          mode : 'redeem',
          status : '500' ,
          response : output
        }));
    

      }
     
    });
  });
  */
}

