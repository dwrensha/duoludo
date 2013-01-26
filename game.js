
function kpress(event) {
// console.log(event)
}

function kup(event) {
// console.log(event)
}

function kdown(event) {
//    console.log(event);
    if (event.which != 0) {
        var targetrow = player.row;
        var targetcol = player.col;
        var move = false;
        switch (event.keyCode) {
        case 37 : // LEFT
            targetcol = player.col - 1;
            move = true;
            break;
        case 38 : // UP
            targetrow = player.row - 1;
            move = true;
            break;
        case 39 : // RIGHT
            targetcol = player.col + 1;
            move = true;
            break;
        case 40 : // DOWN
            targetrow = player.row + 1;
            move = true;
            break;
        default:
        }

    render();

    return true;
}


turnInterval = window.setInterval(takeTurn, 200);
window.onkeypress = kpress;
window.onkeyup = kup;
window.onkeydown = kdown;
