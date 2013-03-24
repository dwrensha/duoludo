var http = require('http');
var url = require('url');

var connect = require('connect');

function start (route) {
    var port = 8080;

    var pathListen = function(request, response) {
        console.log(request.headers);
        var pathname = url.parse(request.url).pathname
        console.log("request for " + pathname + " received");


        if (request.method == 'POST' ) {
            console.log('POST!');
            request.on('data', function (stream) {
                console.log('data: ' + stream);
            });
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("got it");
            response.end();
            return
        }
        route(pathname);
    }

    connect()
    .use(connect.static( __dirname + '/../client'))
    .use(pathListen)
    .listen(port);


    console.log("server has started listening on port " + port);
}

exports.start = start;