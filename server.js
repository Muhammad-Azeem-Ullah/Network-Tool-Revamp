

var mikroNode              = require( 'mikronode' );
var requestController    = require( './Controllers/request-controller.js' );
var controllerMongo      = require( './Controllers/mongo-controller.js' );

//Defining object variable to use mikrotik api in nodejs
var routerSubMaskIp = '192.168.8';
var routerIp        =  routerSubMaskIp + '0.1';
var mikroTipObject  =  new mikroNode( routerIp );

//Defining mongodb onjects variables

const databaseName                = 'caramelNetworkDb';
const networkDnsLog               = 'networkDnsLog';
const networkUserDetails          = 'networkUserDetails';
const networkUserRequestDetails   = 'networkUserRequestDetails';


const databasePromise = new Promise( function ( resolve , reject ){
  try{
    controllerMongo.createConnection( databaseName , networkDnsLog , networkUserDetails , networkUserRequestDetails  );
    resolve( 'fine' );
  }catch(ex){
    reject('error');
  }
});
databasePromise
  .then( function whenOk( response ) {
    mikroConnection();
  })
  .catch(function notOk(err) {
    console.error(err)
  });


//
//
// @since 1.0
// Connecting to the mikroTik router live and performing
function mikroConnection() {
  
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
          console.log( 'DNS request failed' );
      });

      //Done instructions for getDns table to save DNS data in database
      channelDnsDetails.on( 'done' , function( result ){

        var dnsDetails        = result.data;
        var dnsdetailsList    =  [];
        // generating listing of objects of dns details
        generateDns( dnsDetails , dnsdetailsList  , callbackGenerateDns = function( dnsDetails , dnsdetailsList ){
            setTimeout( function() { generateDns( dnsDetails , dnsdetailsList , callbackGenerateDns ) } , 0 );
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
  function generateDns( dnsDetails , dnsdetailsList , callbackGenerateDns  ){

    item = dnsDetails.shift();
    if( item ){
      dnsdetailsList.push( { 'ipAddress' : item[2].value , 'urlLink' : item[1].value  } );
      callbackGenerateDns( dnsDetails , dnsdetailsList );
    }
    else{
      controllerMongo.saveDnsDetails( dnsdetailsList ); 
      requestController.requestControllerMain( controllerMongo  );
    }
  }

  

