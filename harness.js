var game = zepto

var state;
var canvas;

var ticks;
var events;

function StampedEvent (stamp, event) {
    this.stamp = ticks;
    this.event = event;
}

function init() {
    canvas = document.getElementById('canvas');
    state = game.init(canvas);
    canvas.onmousedown = mdown;
    window.onkeyup = kup;
    window.onkeydown = kdown;
    ticks = 0;
    events = Array();
}

function tick() {
    state = game.tick(state);
    ++ticks;
}

function kup(event) {
    events.push(new StampedEvent(ticks, event));
    state = game.kup(event, state);
}

function kdown(event) {
    events.push(new StampedEvent(ticks, event));
    state = game.kdown(event, state);
}

function mdown(event) {
    events.push(new StampedEvent(ticks, event));
    state = game.mdown(event, state);
}

// tick 40 times per second
var interval = window.setInterval(tick, 25);
