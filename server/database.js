assert = require('assert');

var MongoClient = require('mongodb').MongoClient;

function connect (f) {
    MongoClient.connect("mongodb://localhost:27017/duoludo", function (err, db) {
        if (err) {
            return console.dir(err);
        } else {
            console.log("successfully connected to mongoDB");
            f(db);
        }
    });
}

function addPath (pathString) {
    path = JSON.parse(pathString);

    // TODO some basic validation of the path

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
            collection.update({}, {$inc : {latestID : 1}}, {upsert:true, new:true},
                              function (err) {
                                  collection.find().toArray(function (err, docs) {
                                      assert.equal(docs.length, 1);
                                      response.write(JSON.stringify(docs[0].latestID));
                                      response.end();
                                  });
                              });
        });
    });
    return 0;
}

exports.addPath = addPath;
exports.getSessionID = getSessionID;