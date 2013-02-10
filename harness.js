var game = zepto

var state;
var canvas;

function init() {
    canvas = document.getElementById('canvas');
    state = game.init(canvas);
    canvas.onmousedown = mdown;
}

function tick() {
    state = game.tick(state);
}

function kpress(event) {
    game.kpress(event, state);
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

window.onkeypress = kpress;
window.onkeyup = kup;
window.onkeydown = kdown;
