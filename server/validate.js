assert = require('assert');
database = require('./database');

var mongo = require('mongodb');
//var BSON = mongo.BSONNative;
//var ObjectId = BSON.ObjectID.createFromHexString;
var ObjectId = require('mongodb').ObjectID
game = require('../client/zepto/zepto').game;


function validatePath (path) {

    game.load(path.startState);

    // copy and reverse |events|
    var events = path.events.slice().reverse();
    var ticks = 0;


    // mimic the control flow in replayMode.tick
    var stop = false;
    while (! stop) {

        var stampedEvent = events[events.length - 1];
        while((!stop) && stampedEvent && (stampedEvent.t <= ticks) &&
              (events.length > 0)) {
            stampedEvent = events.pop();
            var event = stampedEvent.e;
            switch (event.type) {
            case "keydown":
                game.kdown(event);
                break;
            case "keyup":
                game.kup(event);
                break;
            case "gameover":
            case "abort":
            case "checkpoint":
                stop = true;
                break;

            }
            stampedEvent = events[events.length - 1];
        }

//        if (!stop) {
            game.tick();
            ++ticks;
//        }
    }

    return ( game.stateequals(game.getstate(), path.endState) &&
             game.atcheckpoint() == path.endCheckpoint );
}


// if path.prev is not an ObjectId or 'start', then make it the
// appropriate ObjectId.
function updatePrev (path) {
    var id = path._id;
    if (path.prev == 'start') {
        return;
    } else if (! path.prev.hasOwnProperty('sessionID')) {
        return;
    }

    var sessionID = path.prev.sessionID;
    var pathID = path.prev.pathID;

    database.connect(function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.findOne({'key.sessionID': sessionID, 'key.pathID': pathID}, function (err, doc) {
                assert.equal(err, null);
                var prevID = doc._id;
                console.log('found the previous: ' + prevID);
                collection.update({_id: id}, {$set : {prev : prevID}}, {w:1}, function (err, doc) {
                    assert.equal(err, null);
                    db.close();
                });
            });
        });
    });

}

function updateValidity (path, validity) {
    console.log('updating validity to ' + validity);
    var id = path._id;

    database.connect(function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.update({_id : id}, {$set : {valid : validity}}, {w:1, upsert:true}, function (err, doc) {
                assert.equal(err, null);
                db.close();
            });
        });
    });

}

function updateCumulativeValidity (path, validity) {
    console.log('updating cumulative validity');
    if (path.prev == 'start') {
        database.connect(function (db) {
            db.collection('paths', function(err, collection) {
                assert.equal(err, null);
                collection.update({_id : path._id}, {$set : {validFromStart : validity}}, {w:1, upsert:true}, function (err,doc){
                    assert.equal(err,null);
                    db.close();
                });
            });
        });
        return;
    } else if (path.prev.hasOwnProperty('sessionID')) {
        // wait until it has an index there
        return;
    }
    // if we are here, we know that path.prev is an ObjectId.
    database.connect(function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.findOne({_id : path.prev}, function (err, prevPath) {
                assert.equal(err,null);
                if (!prevPath.hasOwnProperty('validFromStart') ) {
                    console.log('not saturated yet');
                    db.close();
                    return;
                }
                console.log('prev vfs: ' + prevPath.validFromStart);
                var validFromStart =  (validity && prevPath.validFromStart);
                collection.update({_id : path._id}, {$set : {validFromStart : validFromStart}}, {w:1, upsert:true}, function (err,doc) {
                    assert.equal(err,null);
                    db.close();
                    return;
                });
            });
        });
    });

}

function doValidation () {
    console.log('hello world');

    database.connect (function (db) {
        db.collection('paths', function(err, collection) {
            assert.equal(err, null);
            collection.find().toArray( function(err, docs) {
                db.close();
                for (var ii = 0; ii < docs.length; ++ii) {
                    var path = docs[ii];
                    updatePrev(path);
                    if (! path.hasOwnProperty('valid') ) {
                        var validity = validatePath(path);
                        updateValidity (path, validity);
                    }
                    if (path.hasOwnProperty('valid') &&
                        (!path.hasOwnProperty('validFromStart'))) {
                        updateCumulativeValidity(path, path.valid);
                    }
                }
            });
        });
    });

}


doValidation();