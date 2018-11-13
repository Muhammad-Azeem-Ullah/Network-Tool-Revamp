/*var ws = new WebSocket( "ws://localhost:8081" );
currentTimeStamp = getDateToTimeStamp();





ws.onopen = function (){
    alert("Connected with Coupon Stalls");
    alert("Welcome !");
    var url = new URL( window.location.href );
    var ip = url.searchParams.get("ip");
    ws.send( JSON.stringify({
        timestamp : currentTimeStamp,
        ipAddress : ip
    }));
    currentTimeStamp = getDateToTimeStamp();
   
 /*   setInterval(function(){ 
        var url = new URL( window.location.href );
        var ip = url.searchParams.get("ip");
        ws.send( JSON.stringify({
            timestamp : currentTimeStamp,
            ipAddress : ip
        }));
        currentTimeStamp = getDateToTimeStamp();
     }, 0);

  };
  
  ws.onmessage = function ( payload )
  {
      alert( payload );
   
     
  }
  ws.onclose = function (){
    alert("Disconnected with Coupon Stalls");
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
    var sec             = d.getSeconds()
    currentTime         =  hours + ":" +  min +":" + sec;
    CurrentTimeStamp    = currentTime  + today ;
    return CurrentTimeStamp;

}   */