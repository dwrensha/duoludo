var canvas;
var context;

var pixelsPerTile = 20;
var worldWidth = map.columns * pixelsPerTile;
var worldHeight = map.rows * pixelsPerTile;
var playerWidth = 10;
var playerHeight = 10;


function drawStates(states, ticks) {

    console.log(states.length);

    states.map(function (state) {state.player = JSON.parse(state.state).player;});


    states.sort(function (a,b) {return b.player.pos.x - a.player.pos.x;});
    console.log(states);

    var cameraX = states[0].player.pos.x + canvas.width / 4 - canvas.width;
    if (cameraX < 0) {
        cameraX = 0;
    }
    else if (cameraX + canvas.width > worldWidth){
        cameraX = worldWidth - canvas.width;
    }

    context.fillStyle = map.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var ii = 0; ii < map.columns; ++ii) {
        for (var jj = 0; jj < map.rows; ++jj) {

            var leftedge = ii * pixelsPerTile - cameraX;
            var topedge = jj * pixelsPerTile;

            if (leftedge <= canvas.width &&
                topedge <= canvas.height &&
                leftedge + pixelsPerTile >= 0 &&
                topedge + pixelsPerTile >= 0) {

                switch (map.getBlinkState(map.getTile(ii,jj), ticks)) {
                case 0 :
                    continue
                case 1 :
                    context.fillStyle = map.checkpointColor;
                    break;
                case 2 :
                    context.fillStyle = map.safeColor;
                    break;
                case 3 :
                    context.fillStyle = map.dangerColor;
                    break;
                default:
                    continue;
                }
                context.fillRect(leftedge, topedge,
                                 pixelsPerTile, pixelsPerTile);
            }
        }
    }


    for (var ii = 0; ii < states.length; ++ii) {
        var player = states[ii].player;

        if (player.ticksDead < 0) { // not dead
            context.fillStyle = map.playerOutlineColor;
            context.fillRect(player.pos.x - cameraX, player.pos.y,
                             playerWidth, playerHeight);
            context.fillStyle = map.playerColor;
            context.fillRect(player.pos.x  - cameraX + 1,
                             player.pos.y + 1,
                             playerWidth - 2, playerHeight - 2 );
        } else {
            context.fillStyle = map.dangerColor;
            context.fillRect(player.pos.x  - cameraX, player.pos.y,
                             playerWidth, playerHeight);

            t = Math.floor(player.ticksDead / 2);
            if (t * 2 < playerWidth) {

                context.fillStyle = map.playerColor;
                context.fillRect(player.pos.x  - cameraX + t,
                                 player.pos.y  + t,
                                 playerWidth - (2 * t),
                                 playerHeight - (2 * t));
            }
        }

    }

    console.log(canvas.toDataURL());
    $.ajax({type:'POST',
            url:'../videoframe?ticks=' + ticks,
            data: canvas.toDataURL()
           })
    .done( function (data) {
        console.log("success!");
    })

}


function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    $.ajax({type:'GET',
            url:'../getstates?ticks=1500'
           })
    .done( function (data) {
        console.log("success!");
        console.log(data);
        drawStates(JSON.parse(data), 1500);
    })
    .fail( function (xhr, status, thrown) {
        console.log("failure");
        console.log(thrown);
    });
}