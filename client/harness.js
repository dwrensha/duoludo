var game = zepto

var stdout;

function StampedEvent (ticks, event) {
    this.t = ticks;
    this.e = event;
};

function recordizeEvent(event) {
    return {"type": event.type,
            "keyCode": event.keyCode
           };
};


var pathlist = {

    add : function (path) {
        var div = document.createElement('div');
        var input = document.createElement('input');
        $(input).attr('type', 'radio')
                .attr('name','path')
                .attr('pathID', path.key.pathID);

        $(input).click(function () {
            self = this;
            game.load(mainMode.lookupPath($(self).attr('pathID')).endState);
            game.render();
        });

        if (path.endCheckpoint != "gameover") {
            $(input).attr('checked', 'true');
        }
        var label = document.createElement('label');
        label.innerHTML = path.key.pathID + ': ' + path.username + ' ' + (new Date(path.startTime)).toUTCString();
        div.appendChild(input);
        div.appendChild(label);

        var closebutton = document.createElement('button');
        closebutton.innerHTML = '&times;';

        $(closebutton).click(function () {
            var parent = $(this).parent();
            parent.slideUp(250, function () { parent.remove();});
        })

        div.appendChild(closebutton);

        $('#pathlist').append(div);

        $.ajax({type:'POST',
                url:'newpath',
                data:JSON.stringify(path)
               })
           .done( function (data) {
           })
           .fail( function (xhr, status, thrown) {
               console.log('error: ' + thrown + " " + xhr.responseText);
           });
    },

    findSelected : function() {
        return $('[name="path"]:checked').attr('pathID');
    },

    hide : function() {
        $('#pathlist').css('display','none');
    },

    show : function() {
        $('#pathlist').show();
    }
};

var replayMode = {
    start : function (path) {
        console.log('replay: ' + JSON.stringify(path));
        pathlist.hide()
        // copy and reverse |events|
        this.events = path.events.slice().reverse();
        stdout.innerHTML = "REPLAY";
        game.load(path.startState);
        game.start()
        $(window).off('keyup keydown');
        $(window).keydown(this.kdown.bind(this));
        this.ticks = path.startTicks;
        this.ticker = window.setInterval(this.tick.bind(this), game.tickMillis);
    },

   stop : function () {
        clearInterval(this.ticker);
        pathlist.show();
        game.stop();
        mainMode.menu();
    },

    tick : function () {
        var stampedEvent = this.events[this.events.length - 1];
        while(stampedEvent && (stampedEvent.t <= this.ticks) &&
              (this.events.length > 0)) {
            stampedEvent = this.events.pop();
            var event = stampedEvent.e;
            switch (event.type) {
            case "keydown":
                game.kdown(event);
                break;
            case "keyup":
                game.kup(event);
                break;
            case "gameover":
            case "abort":
            case "checkpoint":
                this.stop();
            }
            stampedEvent = this.events[this.events.length - 1];
        }

        game.tick();
        game.render();
        ++this.ticks;
    },

    kdown : function (event) {
        if (event.keyCode == 88) { // X key
            this.stop()
        }
    }
};


var mainMode = {
    paths : Array(),

    lookupPath : function(pathID) {
        for (var ii = 0; ii < this.paths.length; ++ii) {
            if (this.paths[ii].key.pathID == pathID) {
                return this.paths[ii];
            }
        }
        return null;
    },

    kdown : function(event) {
        if (event.keyCode == 13) { // ENTER
            var selected = pathlist.findSelected();
            if (selected) {
                playMode.start(this.lookupPath(selected.valueOf()));
            } else {
                playMode.start();
            }
        } else if (event.keyCode == 82 /* 'r' */ ) {
            var selected = pathlist.findSelected();
            if (selected) {
                replayMode.start(this.lookupPath(selected.valueOf()));
            }
        }
    },

    menu : function () {
        stdout.innerHTML = "MAIN MENU. PRESS ENTER TO PLAY";
        $(window).off('keydown keyup');
        $(window).keydown(this.kdown.bind(this));
    },

    registerPath : function (path) {
        this.paths.push(path);
        pathlist.add(path);
    }
};

var playMode = {
    sessionID : 0, // we'll GET a unique one from the server

    lastPathID : 0,
    getPathID: function () {
        ++this.lastPathID;
        return this.lastPathID;
    },

    // prevPath is optional.
    start : function (prevPath) {
        pathlist.hide();
        stdout.innerHTML = "YOU ARE NOW PLAYING";


        var prev;
        if (prevPath) {
            game.load(prevPath.endState);
            prev = prevPath.key;
            this.ticks = prevPath.endTicks;
        } else {
            this.ticks = 0;
            game.load();
            prev = "start";
        }
        game.start();
        $(window).off('keyup keydown');
        $(window).keyup(this.kup.bind(this));
        $(window).keydown(this.kdown.bind(this));

        var username = $('#username').attr('value');

        this.path = {username : username,
                     startTime:  Date.now(), // milliseconds since the dawn of time
                     startState: game.getstate(),
                     startTicks : this.ticks,
                     prev : prev};

        cp = game.atcheckpoint();
        if (cp) {
            this.path.startCheckpoint = cp;
        } else {
            this.path.startCheckpoint = false;
        }

        this.events = Array();
        this.ticker = window.setInterval(this.tick.bind(this), game.tickMillis);
    },

    stop : function (endCheckpoint) {
        clearInterval(this.ticker);
        pathlist.show();
        game.prestop();
        game.stop();
        this.path.endCheckpoint = endCheckpoint;
        this.path.events = this.events;
        this.path.endState = game.getstate();
        this.path.endTicks = this.ticks;
        this.path.key = {
            sessionID: this.sessionID,
            pathID : this.getPathID()};
        mainMode.registerPath(this.path);
        mainMode.menu();
    },

    tick : function () {
        game.tick();
        game.render();
        cp = game.atcheckpoint();
        if (cp) {
            console.log("at checkpoint: " + cp);
            if (cp == 'pause' ||
                cp != this.path.startCheckpoint ) {
                this.events.push(new StampedEvent(this.ticks, {'type':'checkpoint'}));
                this.stop(cp);
            }
        }

        ++this.ticks;
    },

    kup : function (event) {
        var revent = recordizeEvent(event);
        this.events.push(new StampedEvent(this.ticks, revent));
        game.kup(revent);
    },

    kdown : function(event) {
        var revent = recordizeEvent(event);
        this.events.push(new StampedEvent(this.ticks, revent));
        game.kdown(revent);
    },

};


function init() {
    stdout = document.getElementById('stdout');
    gameDiv = document.getElementById('game')

    game.init(gameDiv);
    stdout.innerHTML = "Enter your username to begin.";
    document.getElementById('usernamebutton').focus();

    $('#leaderboardbutton').click(function () {
        $.ajax({type:'GET',
                url:'getleaderboard'})
            .done( function (data) {
                console.log(data);
            });
        console.log('leaderboard');
    });


    var gotSessionID =
        $.ajax({type:'GET',
            url:'newsession',
           })
           .done( function (data) {
               playMode.sessionID = parseInt(data.valueOf());
               console.log('sessionID: ' + data.valueOf());
           })
           .fail( function (xhr, status, thrown) {
               console.log('error: ' + thrown + " " + xhr.responseText);
           });

    var gotUsername = $.Deferred();
    $('#usernamebutton').click(function () {
        var username = $('#usernameinput').val();
        $('#username').html('username: ' + username).attr('value', username);
        gotUsername.resolve();
    });

    $.when( gotSessionID, gotUsername ).done (function () {
        mainMode.menu();
    });




};
