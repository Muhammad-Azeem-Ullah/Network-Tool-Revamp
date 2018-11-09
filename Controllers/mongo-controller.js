
var http              = require('http');
var MongoClient       = require('mongodb').MongoClient;
var url               = "mongodb://localhost:27017/";

//Defining object varaible to use mikrotik api in nodejs
var databaseObject;
var databaseCouponsObject; 
var databaseName;
var dbCouponCollection;

//
//
//@Since same
//Module exports for mongodb intraction
 module.exports.createConnection =  function createConnnectWithMongo( dbName , networkDnsLog  , networkUserDetails , networkUserRequestDetails  )
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    databaseObject = db.db( dbName );
    databaseObject.createCollection( networkDnsLog , function(err, res) {
    });
    databaseObject.createCollection( networkUserDetails , function(err, res) {
    });
     databaseObject.createCollection( networkUserRequestDetails , function(err, res) {
    });
    databaseName         = dbName;
    dbCouponCollection   = networkDnsLog;
  });
}


module.exports.saveDnsDetails =  function saveDnsDetailsModule( dnsDetails  )
{
  databaseObject.collection( dbCouponCollection ).insertMany( dnsDetails , function(err, res) {
      if (err) throw err;
    });
}


module.exports.saveUserDetails =  function saveUserDetails( userDetail  )
{

  database_object.collection( "networkUserDetails" ).update(
    {  ipAddress : userDetail.ipAddress  },
    userDetail ,
    { upsert: true }
 );

}
