var editor = (function () {

    var context;
    var canvas;

    var spacebar = ' '.charCodeAt(0)

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

    var pixelsPerTile = 20;
    var worldWidth = map.columns * pixelsPerTile;
    var worldHeight = map.rows * pixelsPerTile;

    function Camera(x, y) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
    }

    function worldToMap (p) {
        return new Vec2(Math.floor(p.x / pixelsPerTile), Math.floor(p.y / pixelsPerTile));
    }

    //
    function getWorldTile (map, p) {
        var mapPos = worldToMap(p)
        return map.getTile(mapPos.x, mapPos.y);
    }

    function render (state) {
        var camera = state.camera
        context.fillStyle = map.backgroundColor;
        context.fillRect(0, 0, worldWidth, worldHeight);

        for (var ii = 0; ii < map.columns; ++ii) {
            for (var jj = 0; jj < map.rows; ++jj) {
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
                context.fillRect(ii * pixelsPerTile - camera.pos.x,
                                 jj * pixelsPerTile - camera.pos.y,
                                 pixelsPerTile, pixelsPerTile);
            }
        }

    }

    var NUM_KEYS = 256;
    var keys = Array();
    var keysNewlyDown = Array(NUM_KEYS);

    // Tick about 40 times per second.
    // This should sync okay with the music at 144 bpm.
    var tickMillis = 26.041;

    var state;

    function tick() {
        var factor = 1;
        if (keys[32] == 1) {
            factor = 4;
        }

        if (keys[37] == 1) {
            // LEFT
            state.camera.pos.x -= 10 * factor;
        }
        if (keys[39] == 1) {
            // RIGHT
            state.camera.pos.x += 10 * factor;
        }
        if (keys[38] == 1) {
            // UP
            state.camera.pos.y -= 10 * factor;
        }
        if (keys[40] == 1) {
            // DOWN
            state.camera.pos.y += 10 * factor;
        }

        render(state);

        for (var ii = 0; ii < NUM_KEYS; ++ii) {
            keysNewlyDown[ii] = 0;
        }
        ++state.ticks;
    }

    function kup(event) {
        if (event.which != 0) {
            keys[event.keyCode] = 0;
        }
    }


    function kdown(event) {
        if (event.which != 0) {
            if (keys[event.keyCode] == 0) {
                keysNewlyDown[event.keyCode] = 1;
            }
            keys[event.keyCode] = 1;
        }
    }

    function mdown(event) {
        var x = event.clientX - canvas.offsetLeft + state.camera.pos.x;
        var y = event.clientY - canvas.offsetTop + state.camera.pos.y;
        var m = worldToMap(new Vec2(x,y))

        var input = document.getElementById('form').input.value;
        var tile = parseInt(input);
        var op = document.getElementById('stderr');

        if (tile >= 0 && tile < map.blinkPatterns.length) {
            v = tile;
            map.setTile(m.x, m.y, v);
            op.innerHTML = "";
        } else if (input == 'map') {
            op.innerHTML = "theMap.values = [" + map.values + "];";
        } else if (input == 'state') {
            op.innerHTML = JSON.stringify(state);
        }

        console.log('mouse down: ' + m.x + ", " +  m.y);
    }

    function init(acanvas) {
        canvas = acanvas
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }

        state = {
            camera: new Camera(0, worldHeight - 320),
            ticks: 0
        };
    }

     return {
        init: init,
        tick: tick,
        kup: kup,
        kdown: kdown,
        mdown: mdown,
        tickMillis: tickMillis
    };
} ());


function init() {
    var canvas = document.getElementById('canvas');

    editor.init(canvas);

    canvas.onmousedown = editor.mdown;
    window.onkeyup = editor.kup;
    window.onkeydown = editor.kdown;

    var ticker = window.setInterval(editor.tick, editor.tickMillis);
}