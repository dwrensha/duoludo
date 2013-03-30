var http = require('http');
var url = require('url');
var connect = require('connect');
var db = require('./db');


function start () {
    var port = 8080;


    var processPath = function(request, response) {
        console.log('new path!');
        var data = '';
        request.on('data', function (stream) {
            data = data + stream;
        });
        request.on('end', function () {
            db.addPath(data);
        });
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("got it");
        response.end();
        return;
    }

    var route = function(request, response) {
        console.log(request.headers);
        var urlpathname = url.parse(request.url).pathname
        console.log("request for " + urlpathname + " received");

        if (urlpathname == '/newpath' && request.method == 'POST') {
            processPath(request, response);
            return;
        }
        else if (urlpathname == '/newsession' && request.method == 'GET') {

        }
    }

    connect()
    .use(connect.static( __dirname + '/../client'))
    .use(route)
    .listen(port);


    console.log("server has started listening on port " + port);
}

exports.start = start;