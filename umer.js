var url = require('url'),
    express = require('express'),
    http = require('http'),
    path = require('path');

let listObj = [];

listObj.push({
    "ipName": "umerPc1",
    "ipAddress": "172.168.0.1",
    "totalUpload": 35590,
    "totalDownload": 100
});
listObj.push({
    "ipName": "umerPc2",
    "ipAddress": "172.168.0.2",
    "totalUpload": 1290,
    "totalDownload": 103240
});
listObj.push({
    "ipName": "umerPc3",
    "ipAddress": "172.168.0.3",
    "totalUpload": 940,
    "totalDownload": 103240
});
listObj.push({
    "ipName": "umerPc4",
    "ipAddress": "172.168.0.4",
    "totalUpload": 950,
    "totalDownload": 100
});
listObj.push({
    "ipName": "umerPc5",
    "ipAddress": "172.168.0.5",
    "totalUpload": 130,
    "totalDownload": 100435
});
listObj.push({
    "ipName": "umerPc6",
    "ipAddress": "172.168.0.6",
    "totalUpload": 290,
    "totalDownload": 10056
});
listObj.push({
    "ipName": "umerPc7",
    "ipAddress": "172.168.0.7",
    "totalUpload": 890,
    "totalDownload": 1800
});
listObj.push({
    "ipName": "umerPc8",
    "ipAddress": "172.168.0.8",
    "totalUpload": 790,
    "totalDownload": 17800
});
listObj.push({
    "ipName": "umerPc9",
    "ipAddress": "172.168.0.9",
    "totalUpload": 7906,
    "totalDownload": 1060
});
listObj.push({
    "ipName": "umerPc10",
    "ipAddress": "172.168.0.10",
    "totalUpload": 90,
    "totalDownload": 1700
});
listObj.push({
    "ipName": "umerPc11",
    "ipAddress": "172.168.0.11",
    "totalUpload": 950,
    "totalDownload": 1040
});
listObj.push({
    "ipName": "umerPc12",
    "ipAddress": "172.168.0.12",
    "totalUpload": 9540,
    "totalDownload": 1060
});
listObj.push({
    "ipName": "umerPc13",
    "ipAddress": "172.168.0.13",
    "totalUpload": 3940,
    "totalDownload": 79100
});
listObj.push({
    "ipName": "umerPc14",
    "ipAddress": "172.168.0.14",
    "totalUpload": 6590,
    "totalDownload": 1040
});
listObj.push({
    "ipName": "umerPc15",
    "ipAddress": "172.168.0.15",
    "totalUpload": 9450,
    "totalDownload": 1800
});

let listObj1 = [];

for (let i = 0; i < 15; i++) {
    listObj1.push({
        "ipName": "umerPc15",
        "ipAddress": "172.168.0.15",
        "type": 9450,
        "targetURL": 1800,
        "numberOfPackets": 1800,
        "packetSize": 1800,
    });
}

var app = express();
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'Views/public')));

var server = http.createServer(app);

app.get('/', function (req, res) {
    res.render("index", {
        "listObj": listObj
    });
});

app.get('/index', function (req, res) {
    res.render("index", {
        "listObj": listObj
    });
});

app.get('/users', function (req, res) {
    res.render("tables", {
        "listObj": listObj
    });
});

app.get('/user', function (req, res) {
    res.render("user", {
        "listObj": listObj
    });
});

app.listen(4000);

















var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
});
server.listen(1337, function () {});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function (message) {
        console.log(message);
        console.log(message.data);
        try {
            var json = JSON.parse(message.data);
            console.log(JSON.parse(message.data));
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
        }
    });

    connection.on('close', function (connection) {
        // close user connection
    });
});