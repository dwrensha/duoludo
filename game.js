var context;
var canvas;

blue = 'rgb(0,190,255)';
magenta = 'rgb(90, 70, 105)';
red = 'rgb(255,0,0)';
navy = 'rgb(0,92,190)';
background = 'rgb(125,125,125)';

var spacebar = ' '.charCodeAt(0)

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
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,
     2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,1,
     1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,1,
     1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
     1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
     ];

function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

function vec2copy (v) {
    return new Vec2(v.x, v.y);
}

function vec2stimes(s, v) {
    return new Vec2(v.x * s, v.y * s);
}

function vec2plus (v1, v2) {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
}

function vec2minus (v1, v2) {
    return new Vec2(v1.x - v2.x, v1.y - v2.y);
}

function getMapTile (map, x, y) {
    return map[ y * mapColumns + x ];
}

var pixelsPerTile = 20;
var worldWidth = mapColumns * pixelsPerTile;
var worldHeight = mapRows * pixelsPerTile;

function Camera(x, y) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
}

var camera = new Camera(0, worldHeight - 320);


function Player(x, y) {
    this.width = 10;
    this.height = 10;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.jumping = -1 // not jumping
    this.center = function () {
        return vec2plus(this.pos, new Vec2(this.width / 2.0,
                                           this.height / 2.0));
    }
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
                context.fillStyle = magenta;
                break;
            default:
                continue;
            }
            context.fillRect(ii * pixelsPerTile - camera.pos.x,
                             jj * pixelsPerTile - camera.pos.y,
                             pixelsPerTile, pixelsPerTile);
        }
    }

    context.fillStyle = navy;
    context.fillRect(player.pos.x - camera.pos.x, player.pos.y - camera.pos.y,
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

    if (keys[37] == 1) {
        // LEFT
        player.vel.x -= 2;
    }
    if (keys[39] == 1) {
        // RIGHT
        player.vel.x += 2;
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
        if (player.vel.x > 0) {
            --player.vel.x;
        } else if (player.vel.x < 0) {
            ++player.vel.x;
        }
    } else {
        // gravity
        player.vel.y += 1;
    }





    if (groundUnderFeet && keysNewlyDown[spacebar] == 1){
        player.jumping = 0;
    } else if ( wallLeft && keysNewlyDown[spacebar] ) {
        player.vel.y = 0;
        player.vel.x += 5;
        player.jumping = 2;
    } else if (wallRight && keysNewlyDown[spacebar]) {
        player.vel.y = 0;
        player.vel.x -= 5;
        player.jumping = 2;
    }

    // clamp the x velocity
    if (player.vel.x > maxdx) {
        player.vel.x = maxdx;
    } else if (player.vel.x < -maxdx) {
        player.vel.x = -maxdx;
    }



    if (player.jumping >= 0) {
        if (keys[spacebar] == 1) {
            ++player.jumping;
            if (player.jumping <= 3) {
                player.vel.y -= 3;
            } else if (player.jumping <= 6) {
                player.vel.y -= 2;
            } else if (player.jumping > 6) {
                player.jumping = -1;
            }
        } else {
            player.jumping = -1;
        }
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
    var leftbound = vec2copy(player.pos);
    var rightbound = vec2plus(leftbound, player.vel);

    if (!overlaps(rightbound)) {
        player.pos = rightbound;
        return;
    }

    while ((Math.abs (leftbound.x - rightbound.x) > 0.2) ||
           (Math.abs (leftbound.y - rightbound.y) > 0.2) ) {
        var mid = vec2plus(vec2stimes(0.5, leftbound),
                           vec2stimes(0.5, rightbound));
        if (overlaps(mid)) {
            rightbound = mid
        } else {
            leftbound = mid
        }
    }

    player.pos = new Vec2(Math.floor(leftbound.x), Math.floor(leftbound.y))

}

function adjustCamera() {
    var center = player.center()
    var offset = vec2minus(center, camera.pos);

    var margin = 0.3;
    if (offset.x > (1.0 - margin) * canvas.width) {
        camera.pos.x = center.x - (1.0 - margin) * canvas.width
    } else if (offset.x < margin * canvas.width) {
        camera.pos.x = center.x - margin * canvas.width
    }

    if (offset.y > (1.0 - margin) * canvas.height) {
        camera.pos.y = center.y - (1.0 - margin) * canvas.height
    } else if (offset.y < margin * canvas.height) {
        camera.pos.y = center.y - margin * canvas.height
    }

}


function tick() {
    playerAct();
    adjustCamera();

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
        if (keys[event.keyCode] == 0) {
            keysNewlyDown[event.keyCode] = 1;
        }
        keys[event.keyCode] = 1;
    }
}


var interval = window.setInterval(tick, 25);
window.onkeypress = kpress;
window.onkeyup = kup;
window.onkeydown = kdown;
