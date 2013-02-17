var game = zepto

var state;
var canvas;

function init() {
    canvas = document.getElementById('canvas');
    state = game.init(canvas);
    canvas.onmousedown = mdown;
    window.onkeyup = kup;
    window.onkeydown = kdown;
}

function tick() {
    state = game.tick(state);
}

function kup(event) {
    state = game.kup(event, state);
}

function kdown(event) {
    state = game.kdown(event, state);
}

function mdown(event) {
    state = game.mdown(event, state);
}

// tick 40 times per second
var interval = window.setInterval(tick, 25);
