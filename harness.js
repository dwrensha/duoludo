var game = zepto

var canvas;
var events;
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
    start : function () {
        events.reverse();
        stdout.innerHTML = "REPLAY";
        game.init(canvas);
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
        var stampedEvent = events[events.length - 1];
        while(stampedEvent && (stampedEvent.stamp <= this.ticks) && (events.length > 0)) {
            stampedEvent = events.pop();
            event = stampedEvent.event;
            switch (event.type) {
            case "keydown":
                game.kdown(event);
                break;
            case "keyup":
                game.kup(event);
                break;
            case "gameover":
                this.stop();
            }
            stampedEvent = events[events.length - 1];
        }

        game.tick();
        ++this.ticks;
    }

}


var mainMode = {
    kdown : function(event) {
        if (event.keyCode == ' '.charCodeAt(0)) {
            playMode.start();
        } else if (event.keyCode == 82 /* 'r' */ ) {
            replayMode.start();
        }
    },

    menu : function () {
        stdout = document.getElementById('stdout');
        canvas = document.getElementById('canvas');
        stdout.innerHTML += "MAIN MENU. SPACE TO PLAY";
        window.onkeydown = this.kdown.bind(this);
    }

}

var playMode = {
    start : function () {
        stdout.innerHTML = "YOU ARE NOW PLAYING";
        game.init(canvas);
        canvas.onmousedown = this.mdown.bind(this);
        window.onkeyup = this.kup.bind(this);
        window.onkeydown = this.kdown.bind(this);
        this.ticks = 0;
        events = Array();
        this.ticker = window.setInterval(this.tick.bind(this), tickMillis);
    },

    stop : function () {
        clearInterval(this.ticker);
        mainMode.menu();
    },

    tick : function () {
        game.tick();
        if (game.isgameover()) {
            stdout.innerHTML = "you're dead";
            events.push(new StampedEvent(this.ticks, {'type':'gameover'}));
            this.stop();
        }
        cp = game.atcheckpoint();
        if (cp) {
            console.log("at checkpoint: " + JSON.stringify(cp));
        }

        ++this.ticks;
    },

    kup : function (event) {
        var revent = recordizeEvent(event);
        events.push(new StampedEvent(this.ticks, revent));
        game.kup(revent);
    },

    kdown : function(event) {
        var revent = recordizeEvent(event);
        events.push(new StampedEvent(this.ticks, revent));
        game.kdown(revent);
    },

    mdown : function (event) {
        //    events.push(new StampedEvent(ticks, event));
        game.mdown(event);
    }

}


function init() {
    mainMode.menu();
}