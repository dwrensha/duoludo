var http = require('http');
var url = require('url');

function start (route) {

    http.createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname
        console.log("request for " + pathname + " received");

        route(pathname);

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World!");
        response.end();
    }).listen(8888);

    console.log("server has started");
}

exports.start = start;