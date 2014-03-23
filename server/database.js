assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID

function connect (f) {
    MongoClient.connect("mongodb://127.0.0.1:27017/duoludo", function (err, db) {
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

function validateClientPath (path) {

    // some basic validation of the path
    if (path.hasOwnProperty('valid') || path.hasOwnProperty('validFromStart')){
        // the client should not set those fields.
        return false;
    }

    if ( (!path.hasOwnProperty('prev')) ||
         (!path.hasOwnProperty('username')) ||
         (!path.hasOwnProperty('startTicks')) ||
         (!path.hasOwnProperty('startCheckpoint'))
         // ... TODO check each field
       ) {
        // the client should not set those fields.
        return false;
    }

    return true;

}

function addPath (pathString, callback) {
    var path = JSON.parse(pathString);

    if (!validateClientPath(path)) {
        return callback("invalid path", null);
    }

    var prev = path.prev;

    connect(function(db) {
        db.collection('paths', function (err, collection) {
            if (prev == 'start') {
                collection.insert(path, {w:1}, function (err, collection) {
                    db.close();
                    return callback(err, path);
                });
            }
            else if (!prev.hasOwnProperty('sessionID')) {
                // then |prev| is an _id. check that it exists.
                collection.findOne({'_id': ObjectId(prev)}, function (err, doc) {
                    if(err || (!doc) ) {db.close();
                                        return callback("previous path not found",null); };
                    collection.insert(path, {w:1}, function (err, collection) {
                        db.close();
                        return callback(null, path);
                    });
                });

            } else {

                var sessionID = prev.sessionID;
                var pathID = prev.pathID;

                collection.findOne({'key.sessionID': sessionID, 'key.pathID': pathID}, function (err, doc) {
                    if(err) {db.close(); return callback(err,null); };
                    if(!doc) {
                        db.close();
                        return callback("previous path not found", null);
                    }
                    path.prev = doc._id.toString();
                    collection.insert(path, {w:1}, function (err, collection) {
                        db.close();
                        return callback(null, path);
                    });
                });
            }
        });
    });
}

function getStates (ticks, response) {
    connect (function (db) {
        db.collection('states', function (err, collection) {
            collection.find({'ticks' : ticks}).toArray(function (err, docs) {
                response.write(JSON.stringify(docs));
                db.close();
                response.end();
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

function ensureIndexes(db) {
    db.collection('paths', function(err,collection) {
       if(err) {
          console.log('failed to ensure index');
          db.close();
       }
       collection.ensureIndex({'_id' : 1}, function (err, res) {
          console.log('ensured index');
	  db.close();
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
                        ensureIndexes(db);
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
exports.getStates = getStates;
