var context;
var canvas;

blue = 'rgb(0,190,255)';
red = 'rgb(255,0,0)';
navy = 'rgb(0,92,190)';
background = 'rgb(125,125,125)';

var mapColumns = 40;
var mapRows = 40;

var map =
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
     1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
     ];

function Vec2(x, y) {
    this.x = x;
    this.y = y;
    this.plus = function (v2) {return new Vec2(this.x + v2.x, this.y + v2.y);}
    this.stimes = function (s) {return new Vec2(this.x * s, this.y * s);}
    this.copy = function () {return new Vec2(this.x, this.y);};
}

function getMapTile (map, x, y) {
    return map[ y * mapColumns + x ];
}

var pixelsPerTile = 20;
var worldWidth = mapColumns * pixelsPerTile;
var worldHeight = mapRows * pixelsPerTile;

var cameraX = 0;
var cameraY = worldHeight - 300;

function Player(x, y) {
    this.width = 10;
    this.height = 10;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
}

var player = new Player(50, worldHeight - 30);

function worldToMap (p) {
    return new Vec2(Math.floor(p.x / pixelsPerTile), Math.floor(p.y / pixelsPerTile));
}

//
function getWorldTile (map, p) {
    var mapPos = worldToMap(p)
    return getMapTile(map, mapPos.x, mapPos.y);
}


function render () {
    context.fillStyle = background;
    context.fillRect(0, 0, worldWidth, worldHeight);

    for (var ii = 0; ii < mapColumns; ++ii) {
        for (var jj = 0; jj < mapRows; ++jj) {
            switch (getMapTile(map,ii,jj)) {
            case 0 :
                continue
            case 1 :
                context.fillStyle = blue;
                break;
            case 2 :
                context.fillStyle = red;
                break;
            default:
                continue;
            }
            context.fillRect(ii * pixelsPerTile - cameraX,
                             jj * pixelsPerTile - cameraY,
                             pixelsPerTile, pixelsPerTile);
        }
    }

    context.fillStyle = navy;
    context.fillRect(player.pos.x - cameraX, player.pos.y - cameraY,
                     player.width, player.height);
}


function init() {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    }
    render();
}

var NUM_KEYS = 256;
var keys = Array();
var keysNewlyDown = Array(NUM_KEYS);

for (var ii = 0; ii < NUM_KEYS; ++ii) {
    keys[ii] = 0;
    keysNewlyDown[ii] = 0;
}

var maxdx = 7;

function overlaps (p) {
    var left = p.x ;
    var right = p.x + player.width - 1;
    var top = p.y;
    var bottom = p.y + player.height - 1;


    return  ((getWorldTile(map, new Vec2(left, bottom)) != 0) ||
             (getWorldTile(map, new Vec2(right, bottom)) != 0) ||
             (getWorldTile(map, new Vec2(left, top)) != 0) ||
             (getWorldTile(map, new Vec2(right, top)) != 0));

}


function playerAct() {

    var move = false;
    if (keys[37] == 1) {
        // LEFT
        move = true
        if (Math.abs(player.vel.x) < maxdx) {
            --player.vel.x;
        }
    }
    if (keys[39] == 1) {
        // RIGHT
        move = true
        if (Math.abs(player.vel.x) < maxdx) {
            ++player.vel.x;
        }
    }
    if (keys[38] == 1) {
        // UP
        --player.vel.y;
    }
    if (keys[40] == 1) {
        // DOWN
        ++player.vel.y;
    }

    var left = player.pos.x - 1;
    var right = player.pos.x + player.width;
    var top = player.pos.y - 1;
    var bottom = player.pos.y + player.height;

    var groundUnderFeet = (getWorldTile(map, new Vec2(left + 1, bottom)) != 0) ||
                          (getWorldTile(map, new Vec2(right - 1, bottom)) != 0);

    var ceilingAboveHead = (getWorldTile(map, new Vec2(left + 1, top)) != 0) ||
                           (getWorldTile(map, new Vec2(right - 1, top)) != 0);

    var wallLeft = (getWorldTile(map, new Vec2(left, bottom - 1)) != 0) ||
                   (getWorldTile(map, new Vec2(left, top + 1)) != 0);

    var wallRight = (getWorldTile(map, new Vec2(right, bottom - 1)) != 0) ||
                    (getWorldTile(map, new Vec2(right, top + 1)) != 0);


    if (groundUnderFeet) {
        //console.log('ground under feet')
        player.vel.y = 0;
        //friction
        if (! move) {
            if (player.vel.x > 0) {
                --player.vel.x;
            } else if (player.vel.x < 0) {
                ++player.vel.x;
            }
        }
    } else {
        // gravity
        player.vel.y += 1;
    }

    if (groundUnderFeet && keysNewlyDown[32] == 1){
        // SPACE
        player.vel.y -= 10;
    }

    if (wallLeft && player.vel.x < 0) {
        player.vel.x = 0;
    } else if (wallRight && player.vel.x > 0) {
        player.vel.x = 0;
    }
    if (ceilingAboveHead && player.vel.y < 0) {
        player.vel.y = 0;
    }


    // binary search. advance until we hit something.
    var leftbound = player.pos.copy();
    var rightbound = leftbound.plus(player.vel);

    if (!overlaps(rightbound)) {
        player.pos = rightbound;
        return;
    }

    while ((Math.abs (leftbound.x - rightbound.x) > 0.2) ||
           (Math.abs (leftbound.y - rightbound.y) > 0.2) ) {
        var mid = leftbound.stimes(0.5).plus (rightbound.stimes(0.5));
        if (overlaps(mid)) {
            rightbound = mid
        } else {
            leftbound = mid
        }
    }

    player.pos = new Vec2(Math.floor(leftbound.x), Math.floor(leftbound.y))

}


function tick() {
    playerAct();

    render();

    for (var ii = 0; ii < NUM_KEYS; ++ii) {
        keysNewlyDown[ii] = 0;
    }

}

function kpress(event) {
// console.log(event)
}

function kup(event) {
// console.log(event)
    if (event.which != 0) {
        keys[event.keyCode] = 0;
    }

}


function kdown(event) {
//    console.log(event);
    if (event.which != 0) {
        keys[event.keyCode] = 1;
        keysNewlyDown[event.keyCode] = 1;
    }
}


var interval = window.setInterval(tick, 25);
window.onkeypress = kpress;
window.onkeyup = kup;
window.onkeydown = kdown;
