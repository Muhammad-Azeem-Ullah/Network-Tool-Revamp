var ws = new WebSocket( "ws://localhost:8081" );
currentTimeStamp = getDateToTimeStamp();

ws.onopen = function (){
  
    var url = new URL( window.location.href );
    var ip = url.searchParams.get("ip");
    ws.send( JSON.stringify({
        timestamp : currentTimeStamp,
        ipAddress : ip
    }));
    currentTimeStamp = getDateToTimeStamp();
   
   
   setInterval(function(){ 
        var url = new URL( window.location.href );
        var ip = url.searchParams.get("ip");
        ws.send( JSON.stringify({
            timestamp : currentTimeStamp,
            ipAddress : ip
        }));
     }, 1000);
     

  };
  
  ws.onmessage = function ( payload )
  {
  
    dataResult = JSON.parse( payload.data );
      if( dataResult.Data !== 'noData' ){
        var outputHtml = ''; 
        var count = 0;
        dataResult.Data.forEach(function(obj) {

            $('#dataTables-example').DataTable().row.add([
                obj.ipName , obj.ipAddress ,  obj.type ,  obj.targetIp ,  obj.numPackets ,  obj.totalSz * 8/(1024.0 * 1024.0) , obj.timestamp 
              ]).draw();
             });
             currentTimeStamp = getDateToTimeStamp();
             

      }
   
     
  }
  ws.onclose = function (){
 //   alert("Disconnected with Coupon Stalls");
  };


function getDateToTimeStamp() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today               = yyyy + '/' + mm + '/' + dd;
    var d               = new Date(); // for now
    var hours           = d.getHours(); // => 9
    var min             = d.getMinutes(); // =>  30
    var sec             = d.getSeconds();
    if( hours < 10 )
    {
        hours = "0"+ hours;
    } if( min < 10)
    {
        min = "0"+ min;
    } if ( sec < 10 ) {
        sec = "0"+ sec;
    }
    currentTime         =  hours + ":" +  min +":" + sec;
    CurrentTimeStamp    = yyyy+''+mm+''+dd+''+hours+''+min+''+sec ;
    return CurrentTimeStamp;

}   