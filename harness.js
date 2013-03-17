var game = zepto

var canvas;
var stdout;

function StampedEvent (ticks, event) {
    this.stamp = ticks;
    this.event = event;
};

function recordizeEvent(event) {
    return {"type": event.type,
            "keyCode": event.keyCode
           };
};


var pathLists = {
    add : function (path) {
        var pathlist = document.getElementById('pathlist');
        var div = document.createElement('div');
        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'path');
        input.setAttribute('pathID', path.pathID);
        var label = document.createElement('label');
        label.innerHTML = path.pathID + ': ' + path.player + ' ' + path.startTime;
        div.appendChild(input);
        div.appendChild(label);
        pathlist.appendChild(div);
    },

    findSelected : function() {
        var elts = document.getElementsByName('path')
        for (var ii = 0; ii < elts.length; ++ii) {
            if (elts[ii].checked) {
                return elts[ii].getAttribute('pathID');
            }
        }
        return null;
    }
};

var replayMode = {
    start : function (path) {
        // copy and reverse |events|
        this.events = path.events.slice().reverse();
        stdout.innerHTML = "REPLAY";
        game.start(path.startState);
        canvas.onmousedown = null;
        window.onkeyup = null;
        window.onkeydown = null;
        this.ticks = 0;
        this.ticker = window.setInterval(this.tick.bind(this), game.tickMillis);
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
};


var mainMode = {
    paths : Array(),

    lookupPath : function(pathID) {
        for (var ii = 0; ii < this.paths.length; ++ii) {
            if (this.paths[ii].pathID == pathID) {
                return this.paths[ii];
            }
        }
        return null;
    },

    kdown : function(event) {
        if (event.keyCode == 13) { // ENTER
            var selected = pathLists.findSelected();
            if (selected) {
                playMode.start(this.lookupPath(selected.valueOf()).endState);
            } else {
                playMode.start();
            }
        } else if (event.keyCode == 82 /* 'r' */ ) {
            var selected = pathLists.findSelected();
            if (selected) {
                replayMode.start(this.lookupPath(selected.valueOf()));
            }
        }
    },

    menu : function () {
        stdout.innerHTML += "MAIN MENU. ENTER TO PLAY";
        window.onkeydown = this.kdown.bind(this);
    },

    registerPath : function (path) {
        this.paths.push(path);
        pathLists.add(path);
    }
};

var playMode = {

    lastPathID : 0,
    getPathID: function () {
        ++this.lastPathID;
        return this.lastPathID;
    },

    // startState is optional.
    start : function (startState) {
        stdout.innerHTML = "YOU ARE NOW PLAYING";
        this.checkpointbox = document.getElementById('checkpointmode'),

        game.start(startState);
        window.onkeyup = this.kup.bind(this);
        window.onkeydown = this.kdown.bind(this);

        this.path = {player : "dwrensha",
                     startTime: (new Date()).toUTCString(),
                     startState: game.getstate()};

        cp = game.atcheckpoint();
        if (cp) {
            this.path.startCheckpoint = cp;
        } else {
            this.path.startCheckpoint = "start";
        }

        this.ticks = 0;
        this.events = Array();
        this.ticker = window.setInterval(this.tick.bind(this), game.tickMillis);
    },

    stop : function (endCheckpoint) {
        clearInterval(this.ticker);
        this.path.endCheckpoint = endCheckpoint;
        this.path.events = this.events;
        this.path.endState = game.getstate();
        this.path.pathID = this.getPathID();
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
            console.log("at checkpoint: " + cp);
            if (this.checkpointbox.input.checked &&
                cp != this.path.startCheckpoint ) {
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

};


function init() {
    stdout = document.getElementById('stdout');
    canvas = document.getElementById('canvas');

    game.init(canvas);
    mainMode.menu();
};