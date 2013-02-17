var game = zepto

var canvas;

var ticks;
var events;

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
}

function tick() {
    game.tick();
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
var interval = window.setInterval(tick, 25);
