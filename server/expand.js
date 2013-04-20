assert = require('assert');
async = require('async');
database = require('./database');

game = require('../client/zepto/zepto').game;

function expandPath (path) {

    game.load(path.startState);

    // copy and reverse |events|
    var events = path.events.slice().reverse();
    var ticks = path.startTicks;

    var states = [];

    // mimic the control flow in replayMode.tick
    var stop = false;
    while (! stop) {

        states.push({username: path.username,
                     ticks : ticks,
                     state : game.getstate()
                    });

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
            case "checkpoint":
                stop = true;
                break;

            }
            stampedEvent = events[events.length - 1];
        }

       if (!stop) {
            game.tick();
            ++ticks;
        }
    }

    return states;

}

function expandAndInsertPath (db, path) {
    return function (callback) {
        db.collection('states', function (err, collection) {
            if (err) {console.log('error'); return callback(err, null);}
            collection.insert(expandPath(path), callback);
        });
    };
}

function expandAllPaths (db, callback) {

    db.collection('paths', function (err, collection) {
        if (err) {return;}
        collection.find({}).toArray(function (err, docs) {
            if(err) {return callback(err, null)}
            console.log('this many: ' + docs.length);
            var fns = docs.map( function (path) { return expandAndInsertPath(db, path);});
            async.series(fns, callback);

        });
    });

}

database.connect ( function(db) {
    expandAllPaths(db, function (err, states) {
        db.close();
    });
});