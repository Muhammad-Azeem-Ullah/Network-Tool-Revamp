var ipCgiRequest    = require('request'),
    fileServer      = require('fs'),
    path            = require('path'),
    lodash          = require('lodash'),
    timestamp       = require('time-stamp');
var controllerMongo ;



var ipCgiRequestUrl = 'http://192.168.80.1/accounting/ip.cgi';
var routerSubMaskIp = '192.168.8';
var ipDetails       = [];

filePath = path.join(__dirname, '../Models/read.txt');
//
//
// @Since 1.0
// Loading ipDetails for system

module.exports.requestControllerMain = function requestControllerMain( controllerMongo_ ) {

    controllerMongo = controllerMongo_;
    const ipDetailsPromise = new Promise( function ( resolve , reject ){
        try{
            fileServer.readFile( filePath,  { encoding: 'utf-8' } , function(err, result) {
                result = result.split( "\n" );
                result.forEach(function( element ) {
                    element = element.split( "-" );
                    ipDetails.push( { 'ipAddress' : element[0] , 'ipName' : element[1] } )
                  });
              });
            resolve( 'fine' );
        }catch(ex){
            reject('error');
        }
      });
      ipDetailsPromise
        .then( function whenOk( response ) {
            ipCgiRequestFunction();
        })
        .catch(function notOk(err) {
            console.error(err)
          });
}
//
// @Since 1.0
// Getting data of requests transmission to internet
function ipCgiRequestFunction(){
   
        
         ipCgiRequest({
             url : ipCgiRequestUrl,
             json : true
         }, function ( error , response , result ) {
             if ( !error && response.statusCode === 200 && result !== undefined ) {
                 // Spliting data for per requests
                 result                    =  result.split( ' * *\n' );
                 requestsDetailsList     =  [];
                 generateRequestData( result , requestsDetailsList , callbackRequestsDetails = function( result , requestsDetailsList ){
                    setTimeout( function() { generateRequestData( result , requestsDetailsList , callbackRequestsDetails  ) } , 0 );
                 } )
             
             }
         });
  
}
//
// @Since 1.0
// Generating Request Details object for DB
function generateRequestData( requestsDetails , requestsDetailsList , callbackRequestsDetails  ){
    var item = requestsDetails.shift();
    if( item ){
        item = item.split(' ');
        dnsIpAddress = item[0];
        if(item[0].indexOf( routerSubMaskIp ) !== -1  ){
            dnsIpAddress = item[1];
        }
        var getDnsIpAddress = new Promise( function ( resolve_new , reject ){
            try{
                controllerMongo.getDnsAddress( dnsIpAddress , resolve_new  );
                
            }catch(ex){
              reject('error');
            }
          });
          getDnsIpAddress
            .then( function whenOk( response ) {
            dnsIpUrl = response.dsnUrl;
            var requestObject;
            if( item[0].indexOf( routerSubMaskIp ) === -1 ){
                var ipSearch = lodash.filter( ipDetails , { 'ipAddress': item[1]  } );
                if( ipSearch[0] ){
                    requestObject = { ipAddress : item[1] , ipName : ipSearch[0].ipName , targetIp :  dnsIpUrl , numPackets :  item[3] , totalSz : item[2] , type : "Download" , timestamp : timestamp('HH:mm:ss YYYY/MM/DD') };
                } else{
                    requestObject = { ipAddress : item[1] , ipName : 'Unknown' , targetIp :  dnsIpUrl , numPackets :  item[3] , totalSz : item[2] , type : "Upload" , timestamp : timestamp('HH:mm:ss YYYY/MM/DD') }
                }
           }else {

            var ipSearch = lodash.filter( ipDetails , { 'ipAddress': item[0]  } );
            if( ipSearch[0] ){
                requestObject = { ipAddress : item[0] , ipName : ipSearch[0].ipName , targetIp :  dnsIpUrl , numPackets :  item[3] , totalSz : item[2] , type : "Download"  , timestamp : timestamp('HH:mm:ss YYYY/MM/DD') };
            } else{
                requestObject = { ipAddress : item[0] , ipName : 'Unknown' , targetIp : dnsIpUrl  , numPackets :  item[3] , totalSz : item[2] , type : "Upload"  , timestamp : timestamp('HH:mm:ss YYYY/MM/DD') }
            }}
        var saverequest = new Promise( function ( resolve , reject ){
            try {
                controllerMongo.saveUserDetails( requestObject  , resolve );
            } catch ( ex ){
              reject('error');
            }
          });
          saverequest
            .then( function whenOk( response ) {
                requestsDetailsList.push( requestObject );
                callbackRequestsDetails( requestsDetails , requestsDetailsList , callbackRequestsDetails  );
            })
            .catch(function notOk(err) {
              console.error(err)
            });
        })
        .catch(function notOk(err) {
          console.error(err)
        });
        
        
    }
    else{
        controllerMongo.saverequestDetails( requestsDetailsList  );
        ipCgiRequestFunction();
    }
  }


  