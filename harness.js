var game = zepto

var canvas;

var ticks;
var ticker;
var events;

var stdout;

// Tick about 40 times per second.
// This should sync okay with the music at 144 bpm.
var tickMillis = 26.041;

function StampedEvent (stamp, event) {
    this.stamp = ticks;
    this.event = event;
}

function startPlaying() {
    stdout.innerHTML = "YOU ARE NOW PLAYING";
    game.init(canvas);
    canvas.onmousedown = mdown;
    window.onkeyup = kup;
    window.onkeydown = kdown;
    ticks = 0;
    events = Array();
    ticker = window.setInterval(tick, tickMillis);
}

function startReplaying() {
    events.reverse();
    stdout.innerHTML = "REPLAY";
    game.init(canvas);
    canvas.onmousedown = null;
    window.onkeyup = null;
    window.onkeydown = null;
    ticks = 0;
    ticker = window.setInterval(tickReplay, tickMillis);
}

function tickReplay() {
    var stampedEvent = events[events.length - 1];
    while(stampedEvent && (stampedEvent.stamp <= ticks) && (events.length > 0)) {
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
            stopPlaying();
        }
        stampedEvent = events[events.length - 1];
    }

    game.tick();
    ++ticks;
}


function mainKdown(event) {
    if (event.keyCode == ' '.charCodeAt(0)) {
        startPlaying();
    } else if (event.keyCode == 82) {
        startReplaying();
    }
}

function mainMenu() {
    stdout = document.getElementById('stdout');
    canvas = document.getElementById('canvas');
    stdout.innerHTML += "MAIN MENU. SPACE TO PLAY";
    window.onkeydown = mainKdown;
}

function stopPlaying() {
    clearInterval(ticker);
    mainMenu();
}

function tick() {
    game.tick();
    if (game.isgameover()) {
        stdout.innerHTML = "you're dead";
        events.push(new StampedEvent(ticks, {'type':'gameover'}));
        stopPlaying();
    }
    if (game.atcheckpoint()) {
        console.log("at checkpoint");
    }

    ++ticks;
}

function kup(event) {
    events.push(new StampedEvent(ticks, event));
    game.kup(event);
}

function kdown(event) {
    events.push(new StampedEvent(ticks, event));
    game.kdown(event);
}

function mdown(event) {
    events.push(new StampedEvent(ticks, event));
    game.mdown(event);
}


