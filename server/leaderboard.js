assert = require('assert');
async = require('async');
database = require('./database');

// get the best path ending at |checkpoint|
function getBest(checkpoint, callback) {
    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);

            // get the one with the smallest value for 'endTicks'
            collection.findOne({endCheckpoint : checkpoint, validFromStart:true},
                               {'sort': 'endTicks'},
                               function (err, path) {
                                   db.close();
                                   if (err) {
                                       console.dir(err);
                                       return;
                                   }
                                   console.log('getting best for ' + checkpoint);
                                   console.log(path.endTicks);
                                   callback(null, path);
                               });
        });
    });
}

function getLeaderboard(response) {
    console.log('getting leaderboard');
    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.distinct('endCheckpoint', {validFromStart:true}, function(err, endCheckpoints) {
                assert.equal(err, null);
                db.close();
                var fns = endCheckpoints.map(
                    function(x) { return function (cb) {getBest(x, cb)} });
                async.series(fns, function (err, results) {
                    console.log('done. length = ' + results.length);

                    response.write(JSON.stringify(results));
                    response.end();
                });
            });
        });
    });
}

//getLeaderboard();

exports.getLeaderboard = getLeaderboard;