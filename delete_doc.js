

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
    controllerMongo.removeCollection(  );
  })
  .catch(function notOk(err) {
    console.error(err)
  });
