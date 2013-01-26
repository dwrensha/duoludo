var context;
var canvas;

function render () {
    context.fillStyle = 'rgb(200,0,0)';
    context.fillRect(20,20,55, 55);
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
