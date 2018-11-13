
var http              = require('http'),
    MongoClient       = require('mongodb').MongoClient,
    mikroNode     = require( 'mikronode' );
var url               = "mongodb://localhost:27017/";

//Defining object varaible to use mikrotik api in nodejs
var databaseObject; 
var networkDnsLog               ;
var networkUserDetails          ;
var networkUserRequestDetails   ;
//Defining object variable to use mikrotik api in nodejs
var routerSubMaskIp = '192.168.8';
var routerIp        =  routerSubMaskIp + '0.1';
var mikroTipObject  =  new mikroNode( routerIp );
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
module.exports.getDnsAddress =  function getDnsAddress( ipAddress , resolve )
{ 
  databaseObject.collection( networkDnsLog ).find( { 'ipAddress' : ipAddress  }   ).toArray(function(err, result) {
    if (err) throw err;
    if( result.length > 0 ){
      resolve( { 'dsnUrl' : result[0].urlLink  } );
    } else {
     mikroConnectionForDbQuery();
      databaseObject.collection( networkDnsLog ).find( { 'ipAddress' : ipAddress  }   ).toArray(function(err, result) {
        if( result.length > 0 ){
          resolve( { 'dsnUrl' : result[0].urlLink  } );
        } else {
          resolve( { 'dsnUrl' : ipAddress  } );
        }
      });

    }
    });
}


module.exports.saveUserDetails =  function saveUserDetails( userDetail , saverequest ){

  if( userDetail.type  === 'Download' ){
    userEntry = {
      '_id'           : userDetail.ipAddress,
      'ipAddress'     : userDetail.ipAddress ,
      'ipName'        : userDetail.ipName ,
      'totalUpload'   : 0 ,
      'totalDownload' : userDetail.totalSz ,
    } ;
  } else {
    userEntry = {
      '_id'      : userDetail.ipAddress ,
      'ipAddress'      : userDetail.ipAddress ,
      'ipName'         : userDetail.ipName ,
      'totalUpload'    : userDetail.totalSz ,
      'totalDownload'  : 0 ,
    };
  }
 
  databaseObject.collection( networkUserDetails ).find( { 'ipAddress' : userEntry.ipAddress  }   ).toArray(function(err, result) {
    if (err) throw err;
    if( result.length > 1 )
    {
      console.log( "Found dup" );
      console.log( result );
      process.exit();
    }
    if( result.length > 0 ){
      delete userEntry._id;
      result = result[0];
      result.totalUpload    = parseInt ( result.totalUpload ) + parseInt( userEntry.totalUpload );
      result.totalDownload  = parseInt ( result.totalDownload ) + parseInt ( userEntry.totalDownload );
      databaseObject.collection( networkUserDetails ).updateOne( { 'ipAddress' : result.ipAddress  } , { $set: result } , function(err, obj) {
        if (err) throw err;
        saverequest( 'fine' );
      })
      
    } else {
     delete userEntry._id;
      databaseObject.collection( networkUserDetails ).insertOne( userEntry , function(err, res) {
        if (err) throw err;
        saverequest( 'fine' );
      });
    }
  });

}
module.exports.saverequestDetails =  function saverequestDetails( requestDetails  ) {
  databaseObject.collection( networkUserRequestDetails ).insertMany( requestDetails , function(err, res) {
      if (err) throw err;
   
    });
}
module.exports.getAllUserDetails =  function getAllUserDetails( res ) {
  databaseObject.collection( networkUserDetails ).find({}).limit( 500 ).toArray(function(err, allUserDetails) {
    if (err) throw err;

    res.render("tables", {
      "listObj": allUserDetails
  });
    return allUserDetails;
  });
}
module.exports.getAllUserRequestDetails =  function getAllUserRequestDetails( ipAddress ,  res ) {
  databaseObject.collection( networkUserRequestDetails ).find( { 'ipAddress' : ipAddress  } ).limit( 500 ).toArray(function( err, allUserRequestDetails ) {
    if (err) throw err;
    res.render("user", {
      "listObj": allUserRequestDetails
  });
    return allUserRequestDetails;
  });
}

module.exports.getAllUserRequestDetailsByIp =  function getAllUserRequestDetailsByIp( ipAddress , timestamp , webSocket ) {
  databaseObject.collection( networkUserRequestDetails ).find( { $and: [ { 'timestamp' : { $gte: timestamp } } , { 'ipAddress' : ipAddress } ] } ).limit( 500 ).toArray(function( err, result ) {
    if (err) throw err;
    console.log( result );
    process.exit();
    ws.send( "reseice" );

  });
}
module.exports.removeCollection =  function removeCollection(   ) {

  databaseObject.collection( networkUserDetails_ ).drop();
  databaseObject.collection( networkUserDetails_ ).find({}).limit( 10 ).toArray(function(err, all_coupons) {
    if (err) throw err;
     process.exit();
  });


}

function mikroConnectionForDbQuery() {
  
  mikroTipObject.connect()
    .then(([login])=>{
      return login( 'admin' , '<<"Ctch@PHase5DHA">>' );
    })//login to the router configuration panel
    .then(function( mtConnection ) {

      var channelDnsDetails    =   mtConnection.openChannel( "getDns" );
      //Command url to send request torouter for dns details
      channelDnsDetails.write( '/ip/dns/cache/getall' );
      setTimeout(function () {
        channelDnsDetails.write( '/ip/dns/cache/getall' );
      }, 1000 * 60 * 60 );

       //Trap for getDns Channel for DNS details
      channelDnsDetails.on( 'trap' , function( data ){
        console.log( data );
          console.log( 'DNS request failed' );
      });

      //Done instructions for getDns table to save DNS data in database
      channelDnsDetails.on( 'done' , function( result ){

        var dnsDetails        = result.data;
        var dnsdetailsList    =  [];
        // generating listing of objects of dns details
        generateDnsForDbQuery( dnsDetails , dnsdetailsList  , callbackGenerateDnsForDbQuery = function( dnsDetails , dnsdetailsList ){
            setTimeout( function() { generateDnsForDbQuery( dnsDetails , dnsdetailsList , callbackGenerateDnsForDbQuery ) } , 0 );
        });

        channelDnsDetails.close();
        mtConnection.close();
      });
    });
  }

  //
  //
  // @Since 1.0
  // Async generate Dns addresses
  function generateDnsForDbQuery( dnsDetails , dnsdetailsList , callbackGenerateDnsForDbQuery  ){

    item = dnsDetails.shift();
    if( item ){
      dnsdetailsList.push( { 'ipAddress' : item[2].value , 'urlLink' : item[1].value  } );
      callbackGenerateDnsForDbQuery( dnsDetails , dnsdetailsList );
    }
    else{
      module.exports.saveDnsDetails( dnsdetailsList ); 

    }
  }