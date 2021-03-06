// allow us to use this on the server side
if (typeof exports != "undefined") {
    var map = require('./map').map;
}


var zepto = (function () {

    var context;
    var canvas;
    var audio;

    var canvasWidth = 400;
    var canvasHeight = 400;

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

    function vec2equals (v1, v2) {
        return (v1.x == v2.x) && (v1.y == v2.y);
    }

    var pixelsPerTile = 20;
    var worldWidth = map.columns * pixelsPerTile;
    var worldHeight = map.rows * pixelsPerTile;
    var playerWidth = 10;
    var playerHeight = 10;


    function Camera(x, y) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
    }

    function Player(x, y) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.jumping = -1; // not jumping
        this.ticksDead = -1; // not dead
    };

    playerCenter = function (player) {
        return vec2plus(player.pos, new Vec2(playerWidth / 2.0,
                                             playerHeight / 2.0));
    };

    function worldToMap (p) {
        return new Vec2(Math.floor(p.x / pixelsPerTile), Math.floor(p.y / pixelsPerTile));
    }

    //
    function getWorldTile (map, p) {
        var mapPos = worldToMap(p)
        return map.getTile(mapPos.x, mapPos.y);
    }

    function render () {
        var player = state.player
        var camera = state.camera
        context.fillStyle = map.backgroundColor;
        context.fillRect(0, 0, worldWidth, worldHeight);

        for (var ii = 0; ii < map.columns; ++ii) {
            for (var jj = 0; jj < map.rows; ++jj) {

                var leftedge = ii * pixelsPerTile - camera.pos.x;
                var topedge = jj * pixelsPerTile - camera.pos.y;

                if (leftedge <= canvas.width &&
                    topedge <= canvas.height &&
                    leftedge + pixelsPerTile >= 0 &&
                    topedge + pixelsPerTile >= 0) {

                    switch (map.getBlinkState(map.getTile(ii,jj), state.ticks)) {
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


        if (player.ticksDead < 0) { // not dead
            context.fillStyle = map.playerOutlineColor;
            context.fillRect(player.pos.x - camera.pos.x, player.pos.y - camera.pos.y,
                             playerWidth, playerHeight);
            context.fillStyle = map.playerColor;
            context.fillRect(player.pos.x - camera.pos.x + 1,
                             player.pos.y - camera.pos.y + 1,
                             playerWidth - 2, playerHeight - 2 );
        } else {
            context.fillStyle = map.dangerColor;
            context.fillRect(player.pos.x - camera.pos.x, player.pos.y - camera.pos.y,
                             playerWidth, playerHeight);

            t = Math.floor(player.ticksDead / 2);
            if (t * 2 < playerWidth) {

                context.fillStyle = map.playerColor;
                context.fillRect(player.pos.x - camera.pos.x + t,
                                 player.pos.y - camera.pos.y + t,
                                 playerWidth - (2 * t),
                                 playerHeight - (2 * t));
            } else {
                context.fillStyle = map.gameoverColor;
                context.fillRect(0,0,canvas.width, canvas.height);
            }


        }
    }

    var maxdx = 6;
    var maxdy = pixelsPerTile;

    function overlaps (p, player) {
        var left = p.x ;
        var right = p.x + playerWidth - 1;
        var top = p.y;
        var bottom = p.y + playerHeight - 1;


        return  ((getWorldTile(map, new Vec2(left, bottom)) > 1) ||
                 (getWorldTile(map, new Vec2(right, bottom)) > 1) ||
                 (getWorldTile(map, new Vec2(left, top)) > 1) ||
                 (getWorldTile(map, new Vec2(right, top)) > 1));
    }


    function playerAct(player) {

        if (player.ticksDead >= 0) {
            ++player.ticksDead;
            return;
        }

        if (state.keys.left > 0) {
            player.vel.x -= 2;
        }
        if (state.keys.right > 0) {
            player.vel.x += 2;
        }

        var left = player.pos.x - 1;
        var right = player.pos.x + playerWidth;
        var top = player.pos.y - 1;
        var bottom = player.pos.y + playerHeight;

        var underFeet = [getWorldTile(map, new Vec2(left + 1, bottom)),
                         getWorldTile(map, new Vec2(right - 1, bottom))];

        var aboveHead = [getWorldTile(map, new Vec2(left + 1, top)),
                         getWorldTile(map, new Vec2(right - 1, top))];

        var toLeft = [getWorldTile(map, new Vec2(left, bottom - 1)),
                      getWorldTile(map, new Vec2(left, top + 1))];

        var toRight = [getWorldTile(map, new Vec2(right, bottom - 1)),
                       getWorldTile(map, new Vec2(right, top + 1))];


        if (map.getBlinkState(underFeet[0], state.ticks) == 3 ||
            map.getBlinkState(underFeet[1], state.ticks) == 3 ||
            map.getBlinkState(aboveHead[0], state.ticks) == 3 ||
            map.getBlinkState(aboveHead[1], state.ticks) == 3 ||
            map.getBlinkState(toLeft[0], state.ticks) == 3 ||
            map.getBlinkState(toLeft[1], state.ticks) == 3 ||
            map.getBlinkState(toRight[0], state.ticks) == 3 ||
            map.getBlinkState(toRight[1], state.ticks) == 3) {
            player.ticksDead = 0;
            return;
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

            //friction
            if (player.vel.x > 2) {
                --player.vel.x;
            } else if (player.vel.x < -2) {
                ++player.vel.x;
            }

        }


        if (groundUnderFeet && (state.keys.spacebar == 1)){
            player.jumping = 0;
        } else if ( wallToLeft && (state.keys.spacebar == 1) ) {
            player.vel.y = 0;
            player.vel.x += 6;
            player.jumping = 2;
        } else if (wallToRight && (state.keys.spacebar == 1)) {
            player.vel.y = 0;
            player.vel.x -= 6;
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
            if (state.keys.spacebar > 0) {
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

    var abort = false;

    function atcheckpoint() {
        if (state.player.ticksDead > 15) {

            // special value indicating end of game
            return "gameover";
        }

        if (abort) {
            // special value indicating abort
            return "abort";
        }

        var x = state.player.pos.x + (playerWidth / 2);
        var y = state.player.pos.y + (playerHeight / 2);
        var w =  new Vec2(x, y);

        if ( 1 == getWorldTile(map, w)) {
            var mapv = worldToMap(w);
            return '(' + mapv.x + ',' + mapv.y + ')';
        }

        return false;

    }


    function adjustCamera(player, camera) {
        var center = playerCenter(player)
        var offset = vec2minus(center, camera.pos);

        var margin = 0.3;
        if (offset.x > (1.0 - margin) * canvasWidth) {
            camera.pos.x = center.x - (1.0 - margin) * canvasWidth
        } else if (offset.x < margin * canvasWidth) {
            camera.pos.x = center.x - margin * canvasWidth
        }

        if (offset.y > (1.0 - margin) * canvasHeight) {
            camera.pos.y = center.y - (1.0 - margin) * canvasHeight
        } else if (offset.y < margin * canvasHeight) {
            camera.pos.y = center.y - margin * canvasHeight
        }

        if (camera.pos.x < 0) {
            camera.pos.x = 0;
        } else if (camera.pos.x + canvasWidth > worldWidth) {
            camera.pos.x = worldWidth - canvasWidth;
        }

        if (camera.pos.y < 0) {
            camera.pos.y = 0;
        } else if (camera.pos.y + canvasHeight > worldHeight) {
            camera.pos.y = worldHeight - canvasHeight;
        }

    }

    // Tick about 40 times per second.
    // This should sync okay with the music at 144 bpm.
    var tickMillis = 26.041;

    var state;

    function tick() {
        playerAct(state.player);
        updateKeys();
        adjustCamera(state.player, state.camera);

        ++state.ticks;
        if (audio) {
            state.musicTime = audio.currentTime;
        }
    }

    function updateKeys() {
        if (state.keys.left > 0) {
            ++state.keys.left;
        }
        if (state.keys.right > 0) {
            ++state.keys.right;
        }
        if (state.keys.spacebar > 0) {
            ++state.keys.spacebar;
        }
    }

    function kup(event) {
        switch (event.keyCode) {
            case 37: // LEFT
              state.keys.left = 0;
              break;
            case 39: //RIGHT
              state.keys.right = 0;
              break;
            case 32: //SPACE
              state.keys.spacebar = 0;
              break;
        }

    }


    function kdown(event) {
        switch (event.keyCode) {
            case 88: // X
               abort = true;
               break;
            case 37: // LEFT
              if (state.keys.left == 0) {
                  state.keys.left = 1;
              }
              break;
            case 39: //RIGHT
              if (state.keys.right == 0) {
                  state.keys.right = 1;
              }
              break;
            case 32: //SPACE
              if (state.keys.spacebar == 0) {
                  state.keys.spacebar = 1;
              }
              break;
        }
    }

    function init(gameDiv) {
        var canvasDiv = document.createElement("div");
        gameDiv.appendChild(canvasDiv);
        canvas = document.createElement('canvas');
        canvas.setAttribute('width',canvasWidth.toString());
        canvas.setAttribute('height',canvasHeight.toString());
        canvasDiv.appendChild(canvas);

        audio = document.createElement("audio");
        audio.setAttribute('loop', 'true');
        audio.setAttribute('preload', 'true');
        gameDiv.appendChild(audio);

        var oggsource = document.createElement('source');
        oggsource.setAttribute('src', 'zepto/zeptodance.ogg');
        audio.appendChild(oggsource);

        var mp3source = document.createElement('source');
        mp3source.setAttribute('src', 'zepto/zeptodance.mp3');
        audio.appendChild(mp3source);

//<p>
//Arrow keys to move. Space to jump.
//</p>

        audio.load();
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }


        // load a title page.

        state = {
            player: new Player(35, worldHeight - 30),
            camera: new Camera(1478.5 * pixelsPerTile, 8 * pixelsPerTile),
            ticks: 0,
            keys: { left : 0,
                    right : 0,
                    spacebar : 0
                  },
            musicTime: 0
        };
        render();

    }


    // During normal play, prestop is called immediately before stop.
    // During playback prestop (but not stop) will
    // be called at the "checkpoint" events where individual paths were
    // stitched together.
    function prestop() {
        // release all keys
        state.keys = { left : 0,
                       right : 0,
                       spacebar : 0
                     };

    }

    // startState is optional.
    function load(startState) {
        abort = false;
        if (startState) {
            state = JSON.parse(startState);
        } else {
            state = {
                player: new Player(35, worldHeight - 30),
                camera: new Camera(0, worldHeight - 320),
//                player: new Player(444 * pixelsPerTile, 2 * pixelsPerTile),
                ticks: 0,
                keys: { left : 0,
                        right : 0,
                        spacebar : 0
                      },
                musicTime: 0
            };
        }

        adjustCamera(state.player, state.camera);
    }


    function start() {
        try {
          audio.currentTime = state.musicTime;
        } catch (e) {
          // This can happen in the Sandstorm app, where range requests are not supported.
          console.error(e);
        }
        if (audio.readyState == 4){
            audio.play();
        } else {
            console.log("NOT ENOUGH");
            audio.play();
        }

    }

    function stop() {
        audio.pause()
    }

    function getstate() {
        return JSON.stringify(state);
    }

    function playerequals (player1, player2) {
        return (vec2equals (player1.pos, player2.pos) &&
                vec2equals (player1.vel, player2.vel) &&
                (player1.jumping == player2.jumping) &&
                (player1.ticksDead == player2.ticksDead)
               );
    }

   function stateequals (state1str, state2str) {
       var state1 = JSON.parse(state1str);
       var state2 = JSON.parse(state2str);
       return ((state1.ticks == state2.ticks) &&
               playerequals (state1.player, state2.player))
    }

    return {
        init: init,
        load: load,
        start: start,
        prestop : prestop,
        stop: stop,
        getstate: getstate,
        render: render,
        tick: tick,
        kup: kup,
        kdown: kdown,
        atcheckpoint: atcheckpoint,
        stateequals : stateequals,
        tickMillis: tickMillis
    };
} ());


// allow us to use this on the server side
if (typeof exports != "undefined") {
    exports.game = zepto;
}
