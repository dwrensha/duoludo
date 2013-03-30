game = require('../client/zepto/zepto').game;

game.load();
console.log(game.getstate());

function validate (path) {

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

        if (!stop) {
            game.tick();
            ++ticks;
        }
    }


    return ( game.stateequals(game.getstate(), path.endState) &&
             game.atcheckpoint() == path.endCheckpoint );
}