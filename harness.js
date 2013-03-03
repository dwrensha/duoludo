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

function startPlaying() {
    stdout.innerHTML = "YOU ARE NOW PLAYING";
    canvas = document.getElementById('canvas');
    game.init(canvas);
    canvas.onmousedown = mdown;
    window.onkeyup = kup;
    window.onkeydown = kdown;
    ticks = 0;
    events = Array();
    // tick 40 times per second
    ticker = window.setInterval(tick, 25);
}

function mainKdown(event) {
    if (event.keyCode == ' '.charCodeAt(0)) {
        startPlaying();
    }
}

function mainMenu() {
    stdout = document.getElementById('stdout');
    stdout.innerHTML = "MAIN MENU. SPACE TO PLAY";
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


