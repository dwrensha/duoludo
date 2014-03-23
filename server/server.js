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
        var requestUrl = url.parse(request.url, true)
        var urlpathname = requestUrl.pathname
        var urlquery = requestUrl.query
        console.log("request for " + urlpathname + " received");
        console.log("query = " + JSON.stringify(urlquery));

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
        } else if (urlpathname == '/getstates' && request.method == 'GET') {
            console.log('getting states');

            var ticks = parseInt(urlquery.ticks);
            if (!isNaN(ticks)) {
                response.writeHead(200, {"Content-Type": "text/plain"});
                database.getStates(ticks, response);
            } else {
                response.writeHead(400, {"Content-Type": "text/plain"});
                response.write('need to specify ticks');
                response.end();
            }
        } else if (process.argv[2] == 'video' && urlpathname=='/videoframe'
                   && request.method == 'POST' ) {
            console.log('doing it');

            // string
            var ticks = urlquery.ticks;
            while (ticks.length < 6) {
                ticks = '0' + ticks
            }
            var filename = 'frames/out' + ticks + '.png'

            var data = '';
            request.on('data', function (stream) {
                data = data + stream;
            });
            request.on('end', function () {
                var base64Data = data.replace(/^data:image\/png;base64,/,"");
                require("fs").writeFile(filename, base64Data, 'base64', function(err) {
                    console.log(err);
                });
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.end();

            });

        }
    }

    connect()
    .use(connect.logger('dev'))
    .use(connect.static( __dirname + '/../client'))
    .use(route)
    .listen(port);


    console.log("server has started listening on port " + port);
}

exports.start = start;
