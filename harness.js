var game = zepto

var canvas;

var ticks;
var ticker;
var events;


var stdout;

function StampedEvent (stamp, event) {
    this.stamp = ticks;
    this.event = event;
}

function init() {
    canvas = document.getElementById('canvas');
    game.init(canvas);
    canvas.onmousedown = mdown;
    window.onkeyup = kup;
    window.onkeydown = kdown;
    ticks = 0;
    events = Array();
    stdout = document.getElementById('stdout');
}

function tick() {
    game.tick();
    if (game.isgameover()) {
        console.log("you're dead");
        stdout.innerHTML = "you're dead";
        clearInterval(ticker);
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

// tick 40 times per second
ticker = window.setInterval(tick, 25);
