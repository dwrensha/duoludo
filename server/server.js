var http = require('http');
var url = require('url');
var connect = require('connect');
var database = require('./database');
database.initialize();

var validate = require('./validate');

var leaderboard = require('./leaderboard');

function start () {
    var port = 8080;

    var processPath = function(request, response) {
        console.log('new path!');
        var data = '';
        request.on('data', function (stream) {
            data = data + stream;
        });
        request.on('end', function () {
            database.addPath(data, function (err, result) {
                if (err) {
                    response.writeHead(400, {"Content-Type": "text/plain"});
                    response.write(err);
                } else {
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write("success");
                }
                response.end();
            });
        });
    }

    var route = function(request, response) {
        console.log(request.headers);
        var urlpathname = url.parse(request.url).pathname
        console.log("request for " + urlpathname + " received");

        if (urlpathname == '/newpath' && request.method == 'POST') {
            processPath(request, response);
            validate.wakeUp();
        }
        else if (urlpathname == '/newsession' && request.method == 'GET') {
            response.writeHead(200, {"Content-Type": "text/plain"});
            database.getSessionID(response);
        } else if (urlpathname == '/getleaderboard' && request.method == 'GET') {
            response.writeHead(200, {"Content-Type": "text/plain"});
            leaderboard.getLeaderboard(response);
        }
    }

    connect()
    .use(connect.static( __dirname + '/../client'))
    .use(route)
    .listen(port);


    console.log("server has started listening on port " + port);
}

exports.start = start;