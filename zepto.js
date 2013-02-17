var zepto = (function () {

    var context;
    var canvas;

    var background = 'rgb(0,0,0)';
    var safeColor = 'rgb(83,0,135)';
    var dangerColor = 'rgb(252, 20, 62)';
    var playerColor = 'rgb(255,125,16)';
    var playerOutlineColor = 'rgb(255,178,56)';
    var checkpointColor = 'rgb(42,42,42)';


    var spacebar = ' '.charCodeAt(0)

    var blinkPatterns =
        [[0],
         [1],
         [2],
         [3],
         [2,3],
         [2,2,3,3],
         [2,3,2,3,2,2,3,3]];

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
        if (x < 0 || y < 0 || x > map.columns - 1 || y > map.rows - 1) {
            return 1;
        }
        return map.values[ y * map.columns + x ];
    }

    function setMapTile (map, x, y, v) {
        if (x < 0 || y < 0 || x > map.columns - 1 || y > map.rows - 1) {
            return false;
        }
        map.values[ y * map.columns + x ] = v;
        return true;
    }


    var pixelsPerTile = 20;
    var worldWidth = map.columns * pixelsPerTile;
    var worldHeight = map.rows * pixelsPerTile;

    function Camera(x, y) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
    }

    function Player(x, y) {
        this.width = 10;
        this.height = 10;
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.jumping = -1; // not jumping
    };

    playerCenter = function (player) {
        return vec2plus(player.pos, new Vec2(player.width / 2.0,
                                             player.height / 2.0));
    };

    function worldToMap (p) {
        return new Vec2(Math.floor(p.x / pixelsPerTile), Math.floor(p.y / pixelsPerTile));
    }

    //
    function getWorldTile (map, p) {
        var mapPos = worldToMap(p)
        return getMapTile(map, mapPos.x, mapPos.y);
    }

    function getTileState (idx, ticks) {
        var pattern = blinkPatterns[idx];
        return pattern[Math.floor(ticks / 20.0) % pattern.length]
    }

    function render (state) {
        var player = state.player
        var camera = state.camera
        context.fillStyle = background;
        context.fillRect(0, 0, worldWidth, worldHeight);

        for (var ii = 0; ii < map.columns; ++ii) {
            for (var jj = 0; jj < map.rows; ++jj) {
                switch (getTileState(getMapTile(map,ii,jj), state.ticks)) {
                case 0 :
                    continue
                case 1 :
                    context.fillStyle = checkpointColor;
                    break;
                case 2 :
                    context.fillStyle = safeColor;
                    break;
                case 3 :
                    context.fillStyle = dangerColor;
                    break;
                default:
                    continue;
                }
                context.fillRect(ii * pixelsPerTile - camera.pos.x,
                                 jj * pixelsPerTile - camera.pos.y,
                                 pixelsPerTile, pixelsPerTile);
            }
        }

        context.fillStyle = playerOutlineColor;
        context.fillRect(player.pos.x - camera.pos.x, player.pos.y - camera.pos.y,
                         player.width, player.height);
        context.fillStyle = playerColor;
        context.fillRect(player.pos.x - camera.pos.x + 1,
                         player.pos.y - camera.pos.y + 1,
                         player.width - 2, player.height - 2 );
    }



    var NUM_KEYS = 256;
    var keys = Array();
    var keysNewlyDown = Array(NUM_KEYS);

    var maxdx = 7;
    var maxdy = pixelsPerTile;

    function overlaps (p, player) {
        var left = p.x ;
        var right = p.x + player.width - 1;
        var top = p.y;
        var bottom = p.y + player.height - 1;


        return  ((getWorldTile(map, new Vec2(left, bottom)) > 1) ||
                 (getWorldTile(map, new Vec2(right, bottom)) > 1) ||
                 (getWorldTile(map, new Vec2(left, top)) > 1) ||
                 (getWorldTile(map, new Vec2(right, top)) > 1));
    }


    function playerAct(player) {

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

        var underFeet = [getWorldTile(map, new Vec2(left + 1, bottom)),
                         getWorldTile(map, new Vec2(right - 1, bottom))];

        var aboveHead = [getWorldTile(map, new Vec2(left + 1, top)),
                         getWorldTile(map, new Vec2(right - 1, top))];

        var toLeft = [getWorldTile(map, new Vec2(left, bottom - 1)),
                      getWorldTile(map, new Vec2(left, top + 1))];

        var toRight = [getWorldTile(map, new Vec2(right, bottom - 1)),
                       getWorldTile(map, new Vec2(right, top + 1))];


        if (underFeet[0] == 3 || underFeet[1] == 3 ||
            aboveHead[0] == 3 || aboveHead[1] == 3 ||
            toLeft[0] == 3 || toLeft[1] == 3 ||
            toRight[0] == 3 || toRight[1] == 3) {
            console.log("you're dead");
        }

        var groundUnderFeet = (underFeet[0] > 1) || (underFeet[1] > 1);

        var ceilingAboveHead = (aboveHead[0] > 1) || (aboveHead[1] > 1);

        var wallToLeft = (toLeft[0] > 1) || (toLeft[1] > 1);

        var wallToRight = (toRight[0] > 1) || (toRight[1] > 1);


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
        } else if ( wallToLeft && keysNewlyDown[spacebar] ) {
            player.vel.y = 0;
            player.vel.x += 5;
            player.jumping = 2;
        } else if (wallToRight && keysNewlyDown[spacebar]) {
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

        // clamp the y velocity
        if (player.vel.y > maxdy) {
            player.vel.y = maxdy;
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

        if (wallToLeft && player.vel.x < 0) {
            player.vel.x = 0;
        } else if (wallToRight && player.vel.x > 0) {
            player.vel.x = 0;
        }
        if (ceilingAboveHead && player.vel.y < 0) {
            player.vel.y = 0;
        }

        // binary search. advance until we hit something.
        var leftbound = vec2copy(player.pos);
        var rightbound = vec2plus(leftbound, player.vel);

        if (!overlaps(rightbound, player)) {
            player.pos = rightbound;
            return;
        }

        while ((Math.abs (leftbound.x - rightbound.x) > 0.2) ||
               (Math.abs (leftbound.y - rightbound.y) > 0.2) ) {
            var mid = vec2plus(vec2stimes(0.5, leftbound),
                               vec2stimes(0.5, rightbound));
            if (overlaps(mid, player)) {
                rightbound = mid
            } else {
                leftbound = mid
            }
        }

        player.pos = new Vec2(Math.floor(leftbound.x), Math.floor(leftbound.y))

    }


    function adjustCamera(player, camera) {
        var center = playerCenter(player)
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

    function tick(state) {
        playerAct(state.player);
        adjustCamera(state.player, state.camera);

        render(state);

        for (var ii = 0; ii < NUM_KEYS; ++ii) {
            keysNewlyDown[ii] = 0;
        }
        ++state.ticks;
        return state;
    }

    function kup(event, state) {
        // console.log(event)
        if (event.which != 0) {
            keys[event.keyCode] = 0;
        }
        return state;
    }


    function kdown(event, state) {
        //console.log(event);
        if (event.which != 0) {
            if (keys[event.keyCode] == 0) {
                keysNewlyDown[event.keyCode] = 1;
            }
            keys[event.keyCode] = 1;
        }
        return state;
    }

    function mdown(event, state) {
        var x = event.clientX - canvas.offsetLeft + state.camera.pos.x;
        var y = event.clientY - canvas.offsetTop + state.camera.pos.y;
        var m = worldToMap(new Vec2(x,y))

        var input = document.getElementById('form').input.value;
        var tile = parseInt(input);
        var op = document.getElementById('output');

        if (tile >= 0 && tile < blinkPatterns.length) {
            v = tile;
            setMapTile(map, m.x, m.y, v);
            op.innerHTML = "";
        } else if (input == 'map') {
            op.innerHTML = "m.values = [" + map.values + "];";
        } else if (input == 'state') {
            op.innerHTML = state.toSource();
        } else {
            // XXX
            eval(input);
        }

        console.log('mouse down: ' + m.x + ", " +  m.y);
        return state;
    }

    function init(acanvas) {
        canvas = acanvas
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }

        for (var ii = 0; ii < NUM_KEYS; ++ii) {
            keys[ii] = 0;
            keysNewlyDown[ii] = 0;
        }

        return {
            player: new Player(50, worldHeight - 30),
            camera: new Camera(0, worldHeight - 320),
            ticks: 0
        }
    }

    return {
        init: init,
        tick: tick,
        kup: kup,
        kdown: kdown,
        mdown: mdown
    };
} ());

