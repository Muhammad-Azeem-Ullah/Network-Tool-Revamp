var MikroNode = require('mikronode');
    
var device = new MikroNode('192.168.80.1');

device.connect()
  .then(([login])=>{
    return login('admin','<<"Ctch@PHase5DHA">>');
  })
  .then(function(conn) {
    console.log( "connected" );

  

    var chan    =   conn.openChannel( "get_dns" );
    chan.write('/ip/dns/cache/getall');

    chan.on('trap',function(data) {
        console.log('Error setting IP: ');
       // console.log( data );
    });
    chan.on('done',function(data) {
 
       data.data.forEach(function(element) {
           console.log(element);
         });
        chan.close();
        conn.close();
    });
    

    /*var chan2    =   conn.openChannel( "listen_for_connection" );
    chan2.write('/ip/dns/cache/getall');

    chan2.on('trap',function(data) {
        console.log('Error setting IP: ');
       console.log( data );
    });
    chan2.on('done',function(data) {
        console.log( "Listencomplete" );
        //console.log( data );
        data.data.forEach(function(element) {
         //   console.log(element);
          });
          
       
        chan.close();
        conn.close();
    });*/
      


    


  
  })