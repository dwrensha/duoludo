assert = require('assert');
async = require('async');
database = require('./database');

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

function getLeaderboard(response) {
    console.log('getting leaderboard');
    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.distinct('endCheckpoint', {validFromStart:true}, function(err, endCheckpoints) {
                assert.equal(err, null);
                var fns = endCheckpoints.map(
                    function(cp) { return getBest(cp, db);});
                async.series(fns, function (err, results) {
                    db.close();
                    console.log('done. length = ' + results.length);
                    results.sort(function cmp (a,b) {
                        // want the long runs on top
                        return b.endTicks - a.endTicks;
                    });
                    response.write(JSON.stringify(results));
                    response.end();
                });
            });
        });
    });
}

//getLeaderboard();

exports.getLeaderboard = getLeaderboard;