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


function stitchPaths (paths) {
    var result = {username : '[stiched together]',
                  startCheckpoint : paths[0].startCheckpoint,
                  startTicks : paths[0].startTicks,
                  startState : paths[0].startState,
                  endTicks : paths[paths.length - 1].endTicks,
                  endState : paths[paths.length - 1].endState,
                  endCheckpoint : paths[paths.length - 1].endCheckpoint,
        }
    var resultEvents = [];
    for (var ii = 0; ii < paths.length; ++ii) {
        resultEvents = resultEvents.concat(paths[ii].events);
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

function getLeaderboard(response) {
    console.log('getting leaderboard');
    database.connect (function (db) {
        findBestPaths(db, function (err, results) {
            assert.equal(err, null);
            if (results.length == 0) {
                db.close();
                response.write('none');
                response.end();
            } else {
                buildBestPath(db, [], results[0], function (err, bestCumulative) {
                    db.close();
                    var result =
                        {cumulative: bestCumulative,
                         pieces : results}
                    console.log('done');
                    response.write(JSON.stringify(result));
                    response.end();
                });
            }
        });
    });
}

exports.getLeaderboard = getLeaderboard;
