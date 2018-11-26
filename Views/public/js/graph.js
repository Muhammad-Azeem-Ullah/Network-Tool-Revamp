var myChart = echarts.init(document.getElementById('line-chart')/* ,  {
    devicePixelRatio: 10,
    width: 300,
    height: 70
} */);

window.WebSocket = window.WebSocket || window.MozWebSocket;
if (!window.WebSocket) {
    console.log('Sorry, but your browser doesn\'t support WebSocket.');
}
// open connection
var connection = new WebSocket('ws://127.0.0.1:1337');
connection.onopen = function () {
    console.log('Connected.');
};
connection.onerror = function (error) {
    console.log('Sorry, but there\'s some problem with your ' +
        'connection or the server is down.');
};
// //Retry after connection lost
// setInterval(function () {
//     if (connection.readyState !== 1) {
//         console.log('Unable to communicate with the WebSocket server.');
//     }
// }, 3000);

connection.onmessage = function (message) {

        var options = JSON.parse(message.data);
        myChart.setOption(options);
    
}