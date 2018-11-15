


   var totalUpload = 0;
   var totalDownload = 0;

var ws = new WebSocket( "ws://localhost:8082" );



$(document).ready(function () {
    $('#dataTables-example').DataTable({
        responsive: true,
        paging: false
    });
    $('#dataTables-example').DataTable().rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        totalUpload += parseFloat( data[2] );
        totalDownload += parseFloat( data[3] );
    
    } );
    
    $(".totalUploadId").html( totalUpload );
    $(".totalDownloadId").html( totalDownload );
 
});
$("#tablebody").on('click', 'td', function () {
    let ip = $(event.target).parent('tr').children('.ipAddress').html(); 
    window.location.href = "user?ip=" + ip;
});

$("#tablebody").on('click', '#btnClear', function () {
    alert($(event.target).attr("data-userId"));
    return false;
});




ws.onopen = function (){

   setInterval(function(){ 

        ws.send( JSON.stringify({
            request : 'Request Data' ,
        }));
     }, 20);
     

  };
  
  ws.onmessage = function ( payload )
  {

    dataResult = JSON.parse( payload.data );
      if( dataResult.Data !== 'noData' ){
        var outputHtml = ''; 
        var count = 0;
        dataResult.Data.forEach(function(obj) {
             jQuery( "#"+ obj.ipAddress.split('.').join('_') + "_upload" ).html( parseInt ( obj.totalUpload ) * 8/(1024.0 * 1024.0) );
             jQuery( "#"+ obj.ipAddress.split('.').join('_') + "_download" ).html( parseInt (obj.totalDownload ) * 8/(1024.0 * 1024.0) );
      });
    }
}
  ws.onclose = function (){
  
 //   alert("Disconnected with Coupon Stalls");
  };

  setInterval(function(){ 

      $( ".ipAddress" ).each(function() {

        ipAddress = $( this ).attr( "id" ).split('.').join('_') ;
        userUspeedObj =  jQuery ( "#"+ipAddress+"_uspeed");
        userUploadObj =  jQuery ( "#"+ipAddress+"_upload");
        userDspeedObj =  jQuery ( "#"+ipAddress+"_dspeed");
        userDownloadObj =  jQuery ( "#"+ipAddress+"_download");

        if( userUspeedObj.attr( 'data-timestamp' ) == undefined )
        {
            userUspeedObj.attr( 'data-timestamp' , getDateToTimeStamp() );
        } else {
            timeDiff =  getDateToTimeStamp() - parseInt( userUspeedObj.attr( 'data-timestamp' ) );
            uspeed = ( parseFloat ( userUploadObj.html() ) - parseFloat( userUspeedObj.attr( 'data-upload' ) )  ) / timeDiff;
            totalUpload += ( parseFloat ( userUploadObj.html() ) - parseFloat( userUspeedObj.attr( 'data-upload' ) )  );
            userUspeedObj.html( uspeed );


            userUspeedObj.attr( "data-upload" ,  userUploadObj.html()   );
            userUspeedObj.attr( 'data-timestamp' , getDateToTimeStamp() );
        }

        if( userDspeedObj.attr( 'data-timestamp' ) == undefined )
        {
            userDspeedObj.attr( 'data-timestamp' , getDateToTimeStamp() );
        } else {
            timeDiff = parseInt( getDateToTimeStamp() ) - parseInt( userDspeedObj.attr( 'data-timestamp' ) );
            uspeed = ( parseFloat ( userDownloadObj.html() ) - parseFloat( userDspeedObj.attr( 'data-download' ) )  ) / timeDiff;
            userDspeedObj.html( uspeed );
            totalDownload += ( parseFloat ( userDownloadObj.html() ) - parseFloat( userDspeedObj.attr( 'data-download' ) )  ) ;

            userDspeedObj.attr( "data-download" ,  userDownloadObj.html()   );
            userDspeedObj.attr( 'data-timestamp' , getDateToTimeStamp() );
        }



      });


      $(".totalUploadId").html( totalUpload );
      $(".totalDownloadId").html( totalDownload );
  

      

 }, 1000);

 



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
    var msec             = d.getMilliseconds();
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




