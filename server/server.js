var http = require('http');
var url = require('url');

var static = require('node-static');

function start (route) {

    var port = 8080;
    var file = new static.Server(__dirname + '/../client');

    http.createServer(function(request, response) {
        console.log(request.headers);
        var pathname = url.parse(request.url).pathname
        console.log("request for " + pathname + " received");


        if (request.method == 'POST' ) {
            console.log('POST!');
            request.on('data', function (stream) {
                console.log('data: ' + stream);
            });
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("Hello World!");
            response.end();
            return
        }

	request.addListener('end', function() {
	    file.serve(request, response);
	});


        route(pathname);


    }).listen(port);

    console.log("server has started listening on port " + port);
}

exports.start = start;