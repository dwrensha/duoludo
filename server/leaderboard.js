assert = require('assert');
async = require('async');
database = require('./database');
var ObjectId = require('mongodb').ObjectID

// get the best path ending at |checkpoint|
function getBest(checkpoint, db) {
    return function (callback) {
        db.collection('paths', function(err, collection) {
            if(err) {return callback(err,null);}

            // get the one with the smallest value for 'endTicks'
            collection.findOne({endCheckpoint : checkpoint, validFromStart:true},
                               {'sort': 'endTicks'}, callback);
        });
    };
}

function findBestPaths(db, callback) {
    db.collection('paths', function(err, collection) {
        if(err) {return callback(err,null);}
        collection.distinct('endCheckpoint', {validFromStart:true}, function(err, endCheckpoints) {
            if(err) {return callback(err,null);}
            var fns = endCheckpoints.map(
                function(cp) { return getBest(cp, db);});
            async.series(fns, function (err, results) {
                console.log('done. length = ' + results.length);
                results.sort(function cmp (a,b) {
                    // want the long runs on top
                    return b.endTicks - a.endTicks;
                });
                callback(null, results);
            });
        });
    });
}

function getLeaderboard(response) {
    console.log('getting leaderboard');
    database.connect (function (db) {
        findBestPaths(db, function (err, results) {
            db.close();
            assert.equal(err, null);
            response.write(JSON.stringify(results));
            response.end();
        });
    });
}

function stitchPaths (paths) {
    paths = paths.slice(10);
    var result = JSON.parse(JSON.stringify(paths[0]));
    var resultEvents = [];
    for (var ii = 0; ii < paths.length; ++ii) {
        resultEvents = resultEvents.concat(paths[ii].events);
        var finalEvent = resultEvents[resultEvents.length - 1];
        console.log(finalEvent);
//        finalEvent.t = finalEvent.t + 1;
    }
    result.events = resultEvents;
    return result;
}


function buildBestPath (db, soFar, current, callback) {
    soFar.push(current);
    if (current.startCheckpoint == 'start') {
        return callback(null, stitchPaths(soFar.reverse()));
    } else {
        db.collection('paths', function (err, collection) {
            if(err) {return callback(err, null);}
            collection.findOne({_id : ObjectId(current.prev)}, function (err, prev) {
                if(err) {return callback(err, null);}
                buildBestPath(db, soFar, prev, callback);

            });
        });
    }

}

function getBestPath(response) {
    console.log('getting best path');
    database.connect (function (db) {
        findBestPaths(db, function(err, results) {
            assert.equal(err, null);
            if(results.length == 0) {
                db.close();
                response.write('none');
                response.end();
            } else {
                buildBestPath(db, [], results[0], function (err, result) {
                    db.close();
                    console.log('done');
                    console.log(JSON.stringify(result));
                    response.write(JSON.stringify(result));
                    response.end();
                });
            }
        });
    });
}


exports.getLeaderboard = getLeaderboard;
exports.getBestPath = getBestPath;