var game = zepto

var canvas;
var stdout;

// Tick about 40 times per second.
 // This should sync okay with the music at 144 bpm.
var tickMillis = 26.041;

function StampedEvent (ticks, event) {
    this.stamp = ticks;
    this.event = event;
}

function recordizeEvent(event) {
    return {"type": event.type,
            "keyCode": event.keyCode
           };
}

var replayMode = {
    start : function (events) {
        // copy and reverse |events|
        this.events = events.slice().reverse();
        stdout.innerHTML = "REPLAY";
        game.start();
        canvas.onmousedown = null;
        window.onkeyup = null;
        window.onkeydown = null;
        this.ticks = 0;
        this.ticker = window.setInterval(this.tick.bind(this), tickMillis);
    },

   stop : function () {
        clearInterval(this.ticker);
        mainMode.menu();
    },

    tick : function () {
        var stampedEvent = this.events[this.events.length - 1];
        while(stampedEvent && (stampedEvent.stamp <= this.ticks) &&
              (this.events.length > 0)) {
            stampedEvent = this.events.pop();
            var event = stampedEvent.event;
            switch (event.type) {
            case "keydown":
                game.kdown(event);
                break;
            case "keyup":
                game.kup(event);
                break;
            case "gameover":
            case "checkpoint":
                this.stop();
            }
            stampedEvent = this.events[this.events.length - 1];
        }

        game.tick();
        ++this.ticks;
    }

}


var mainMode = {
    paths : Array(),
    events : Array(),

    kdown : function(event) {
        if (event.keyCode == ' '.charCodeAt(0)) {
            playMode.start();
        } else if (event.keyCode == 82 /* 'r' */ ) {
            replayMode.start(this.events);
        }
    },

    menu : function () {
        stdout.innerHTML += "MAIN MENU. SPACE TO PLAY";
        window.onkeydown = this.kdown.bind(this);
    },

    registerPath : function (path) {
        this.events = path.events;
        this.paths.push(path);
        console.log(path);
    }

}

var playMode = {

    // startState is optional.
    start : function (startState) {
        stdout.innerHTML = "YOU ARE NOW PLAYING";

        this.checkpointmode = document.getElementById('checkpointmode').input.checked;

        console.log(this.checkpointmode);
        game.start(startState);
        canvas.onmousedown = this.mdown.bind(this);
        window.onkeyup = this.kup.bind(this);
        window.onkeydown = this.kdown.bind(this);


        this.path = {player : "dwrensha",
                     startTime: new Date(),
                     startState: game.getstate()};


        cp = game.atcheckpoint();
        if (cp) {
            this.path.startCheckpoint = cp;
        } else {
            this.path.startCheckpoint = "start";
        }

        this.ticks = 0;
        this.events = Array();
        this.ticker = window.setInterval(this.tick.bind(this), tickMillis);
    },

    stop : function (endCheckpoint) {
        clearInterval(this.ticker);
        this.path.endCheckpoint = endCheckpoint;
        this.path.events = this.events;
        this.path.endState = game.getstate();
        mainMode.registerPath(this.path);
        mainMode.menu();
    },

    tick : function () {
        game.tick();
        if (game.isgameover()) {
            stdout.innerHTML = "you're dead";
            this.events.push(new StampedEvent(this.ticks, {'type':'gameover'}));
            this.stop("gameover");
        }
        cp = game.atcheckpoint();
        if (cp) {
            console.log("at checkpoint: " + JSON.stringify(cp));
            if (this.checkpointmode) {
                this.events.push(new StampedEvent(this.ticks, {'type':'checkpoint'}));
                this.stop(cp);
            }
        }

        ++this.ticks;
    },

    kup : function (event) {
        var revent = recordizeEvent(event);
        this.events.push(new StampedEvent(this.ticks, revent));
        game.kup(revent);
    },

    kdown : function(event) {
        var revent = recordizeEvent(event);
        this.events.push(new StampedEvent(this.ticks, revent));
        game.kdown(revent);
    },

    mdown : function (event) {
        //    events.push(new StampedEvent(ticks, event));
        game.mdown(event);
    }

}


function init() {
    stdout = document.getElementById('stdout');
    canvas = document.getElementById('canvas');

    game.init(canvas);
    mainMode.menu();
}