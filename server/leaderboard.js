assert = require('assert');
database = require('./database');

// get the best path ending at |checkpoint|
function getBest(checkpoint) {
    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);

            // get the one with the smallest value for 'endTicks'
            collection.findOne({endCheckpoint : checkpoint, validFromStart:true},
                               {'sort': 'endTicks'},
                               function (err, path) {
                                   console.log('getting best for ' + checkpoint);
                                   console.log(path.endTicks);
                                   console.log(JSON.stringify(path) + '\n');
                                   db.close();
                               });
        });
    });
}

function getLeaderboard() {
    console.log('getting leaderboard');
    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.distinct('endCheckpoint', function(err, endCheckpoints) {
                assert.equal(err, null);
                db.close();
                for (var ii = 0; ii < endCheckpoints.length; ++ii) {
                    getBest(endCheckpoints[ii]);
                }
            });
        });
    });
}

getLeaderboard();