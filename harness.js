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
    game.kup(event, state);
}

function kdown(event) {
    game.kdown(event, state);
}

function mdown(event) {
    game.mdown(event, state);
}

// tick 40 times per second
var interval = window.setInterval(tick, 25);
