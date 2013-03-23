var http = require('http');
var url = require('url');

var static = require('node-static');

function start (route) {

    var port = 8080;
    var file = new static.Server('/home/david/Code/duoludo/client');

    http.createServer(function(request, response) {

	request.addListener('end', function() {
	    file.serve(request, response);
	});

        var pathname = url.parse(request.url).pathname
        console.log("request for " + pathname + " received");
        route(pathname);
//        response.writeHead(200, {"Content-Type": "text/plain"});
//        response.write("Hello World!");
//        response.end();
    }).listen(port);

    console.log("server has started listening on port " + port);
}

exports.start = start;