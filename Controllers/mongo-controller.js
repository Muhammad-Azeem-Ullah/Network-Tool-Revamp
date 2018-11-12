
var http              = require('http');
var MongoClient       = require('mongodb').MongoClient;
var url               = "mongodb://localhost:27017/";

//Defining object varaible to use mikrotik api in nodejs
var databaseObject; 
var networkDnsLog               ;
var networkUserDetails          ;
var networkUserRequestDetails   ;

//
//
//@Since 1.0
//Module exports for mongodb intraction
 module.exports.createConnection =  function createConnnectWithMongo( dbName , networkDnsLog_  , networkUserDetails_ , networkUserRequestDetails_  ){

  MongoClient.connect(url, { useNewUrlParser: true } , function(err, db) {
    if (err) throw err;
    databaseObject = db.db( dbName );
    databaseObject.createCollection( networkDnsLog_ , function(err, res) {
      if (err) throw err;
      
    });
    databaseObject.createCollection( networkUserDetails_ , function(err, res) {
      if (err) throw err;
    });
     databaseObject.createCollection( networkUserRequestDetails_ , function(err, res) {
      if (err) throw err;
    });
    databaseName                      = dbName;
    networkDnsLog                     = networkDnsLog_;
    networkUserDetails                = networkUserDetails_;
    networkUserRequestDetails         = networkUserRequestDetails_;
  });
}


module.exports.saveDnsDetails =  function saveDnsDetailsModule( dnsDetails  )
{
  databaseObject.collection( networkDnsLog ).insertMany( dnsDetails , function(err, res) {
      if (err) throw err;
    });
}


module.exports.saveUserDetails =  function saveUserDetails( userDetail  ){

  if( userDetail.type  === 'Download' ){
    userEntry = {
      ipAddress     : userDetail.ipAddress ,
      ipName        : userDetail.ipName ,
      totalUpload   : 0 ,
      totalDownload : userDetail.totalSz ,
    } ;
  } else {
    userEntry = {
      ipAddress      : userDetail.ipAddress ,
      ipName         : userDetail.ipName ,
      totalUpload    : userDetail.totalSz ,
      totalDownload  : 0 ,
    };
  }
  //console.log( userEntry );
  databaseObject.collection( networkUserDetails ).find( { 'ipAddress' : userEntry.ipAddress  } ).toArray(function(err, result) {
    if (err) throw err;
    //console.log( result );
    if( result.length > 0 ){
      delete userEntry._id;
      result = result[0];
      result.totalUpload    = result.totalUpload + userEntry.totalUpload;
      result.totalDownload  = result.totalDownload + userEntry.totalDownload;
      databaseObject.collection( networkUserDetails ).updateOne( { 'ipAddress' : result.ipAddress  } , { $set: result } , function(err, obj) {
        if (err) throw err;
      })
    }else {
      delete userEntry._id;
      databaseObject.collection( networkUserDetails ).insertOne( userEntry , function(err, res) {
        if (err) throw err;
      });
    }

  });

}
module.exports.saverequestDetails =  function saverequestDetails( requestDetails  ) {
  databaseObject.collection( networkUserRequestDetails ).insertMany( requestDetails , function(err, res) {
      if (err) throw err;
      console.log( requestDetails );
    });
}
module.exports.getAllUserDetails =  function getAllUserDetails(  ) {
  databaseObject.collection( networkUserDetails ).find({}).limit( 500 ).toArray(function(err, allUserDetails) {
    if (err) throw err;
    return allUserDetails;
  });
}
module.exports.removeCollection =  function removeCollection(   ) {

  databaseObject.collection( networkUserDetails_ ).drop();
  databaseObject.collection( networkUserDetails_ ).find({}).limit( 10 ).toArray(function(err, all_coupons) {
    if (err) throw err;
    console.log(all_coupons);
     process.exit();
  });


}