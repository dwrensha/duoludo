var http = require('http');
var url = require('url');
var connect = require('connect');

var MongoClient = require('mongodb').MongoClient;

function start () {
    var port = 8080;

    function addPath (pathString) {
        path = JSON.parse(pathString);

        console.log(path);

        // TODO some basic validation of the path

        MongoClient.connect("mongodb://localhost:27017/duoludo", function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                console.log("successfully connected to mongoDB");
            }

            var collection = db.collection('paths', function (err, collection) {
                collection.insert(path, {w:1}, function (err, collection) {
                    if (err) {
                        console.log('error');
                        return console.dir(err);
                    } else {
                        console.log("sucessfully inserted into collection");
                    }
                } );
            });

            db.close();
        });
    }


    var pathListen = function(request, response) {
        console.log(request.headers);
        var pathname = url.parse(request.url).pathname
        console.log("request for " + pathname + " received");


        if (request.method == 'POST' ) {
            console.log('POST!');
            var data = ''
            request.on('data', function (stream) {
                data = data + stream;
            });
            request.on('end', function () {
                addPath(data);
            });
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("got it");
            response.end();
            return;
        }
    }

    connect()
    .use(connect.static( __dirname + '/../client'))
    .use(pathListen)
    .listen(port);


    console.log("server has started listening on port " + port);
}

exports.start = start;