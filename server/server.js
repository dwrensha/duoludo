var http = require('http');
var url = require('url');
var connect = require('connect');

var MongoClient = require('mongodb').MongoClient;

function start () {
    var port = 8080;

    MongoClient.connect("mongodb://localhost:27017/duoludo", function(err, db) {
        if (err) {
            return console.dir(err);
        } else {
            console.log("successfully connected to mongoDB");
        }

        var collection = db.createCollection('test', function (err, collection) {
            var doc1 = {'hello':'doc1'};
            var doc2 = {'hello':'doc2'};

//            collection.insert(doc1, function (err, collection) {} );
        });

    });

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