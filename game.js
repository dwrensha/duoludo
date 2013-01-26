var context;
var canvas;

blue = 'rgb(0,190,255)';
red = 'rgb(255,0,0)';
navy = 'rgb(0,92,190)';

var mapColumns = 100;
var mapRows = 100;

var map = new Array(mapColumns);
for (var ii = 0; ii < map.length; ++ii) {
    map[ii] = new Array(mapRows)
    for (var jj = 0; jj < map[ii].length; ++jj) {
        map[ii][jj] = Math.floor(Math.random() * 2);
    }
};

var pixelsPerTile = 10;
var worldWidth = mapColumns * pixelsPerTile;
var worldHeight = mapRows * pixelsPerTile;

var cameraX = worldWidth / 2.0;
var cameraY = worldHeight / 2.0;

function render () {
    for (var ii = 0; ii < map.length; ++ii) {
        for (var jj = 0; jj < map[ii].length; ++jj) {
            switch (map[ii][jj]) {
            case 0 :
                context.fillStyle = blue;
                break;
            case 1 :
                context.fillStyle = red;
                break;
            default:
            }
            context.fillRect(ii * pixelsPerTile, jj * pixelsPerTile, pixelsPerTile, pixelsPerTile);
        }
    }

    context.fillStyle = navy;
    context.fillRect(50,50,20, 20);
}


function init() {
    console.log("initing");
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    }
    render();
}



function kpress(event) {
// console.log(event)
}

function kup(event) {
// console.log(event)
}

function kdown(event) {
//    console.log(event);
    if (event.which != 0) {
          var move = false;
        switch (event.keyCode) {
        case 37 : // LEFT
              move = true;
            break;
        case 38 : // UP
              move = true;
            break;
        case 39 : // RIGHT
              move = true;
            break;
        case 40 : // DOWN
              move = true;
            break;
        default:
        }
    }
    render();

    return true;
}

//var turnInterval = window.setInterval(takeTurn, 200);
window.onkeypress = kpress;
window.onkeyup = kup;
window.onkeydown = kdown;
