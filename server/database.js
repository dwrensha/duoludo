assert = require('assert');

var MongoClient = require('mongodb').MongoClient;

function connect (f) {
    MongoClient.connect("mongodb://localhost:27017/duoludo", function (err, db) {
        if (err) {
            console.log("error!");
            if (db) {
                db.close();
            }
            return console.dir(err);
        } else {
            console.log("connected to mongo");
            f(db);
        }
    });
}

function addPath (pathString) {
    path = JSON.parse(pathString);

    // TODO some basic validation of the path
    if (path.hasOwnProperty('valid') || path.hasOwnProperty('validFromStart')){
        // the client should not set those fields.
        return false;
    }

    connect(function(db) {
        db.collection('paths', function (err, collection) {
            collection.insert(path, {w:1}, function (err, collection) {
                db.close();
                if (err) {
                    console.log('error');
                    return console.dir(err);
                } else {
                    console.log("sucessfully inserted path");
                }
            });
        });
    });
}

function getSessionID (response) {
    connect (function (db) {
        db.collection('sessions', function (err, collection) {
            collection.findAndModify({}, [['latestID', 1]],
                                     {$inc : {latestID : 1}},
                                     {new:true, w:1}, function (err, doc) {
                                         response.write(JSON.stringify(doc.latestID));
                                         response.end();
                                         db.close()
                                     });

        });
    });
}

function initialize () {
    connect (function (db) {
        db.collection('sessions', function (err, collection) {
            collection.find().toArray(function (err, docs) {
                assert.ok(docs.length < 2);
                if (docs.length < 1) {
                    collection.insert({'latestID':0}, {w:1}, function (err, doc) {
                        console.log('initialized the sessions collection');
                    });
                }
            });
        });
    });
}

exports.connect = connect;
exports.initialize = initialize;
exports.addPath = addPath;
exports.getSessionID = getSessionID;