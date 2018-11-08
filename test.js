var ipCgiRequest = require("request")
var ipCgiRequestUrl = 'http://192.168.80.1/accounting/ip.cgi';

ipCgiRequest({
    url : ipCgiRequestUrl,
    json : true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {

        body = body.split( '* *\n' );
        console.log(body) // Print the json response
        console.log( "yess" ) // Print the json response
    }
})