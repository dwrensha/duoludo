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

    addLocal : function (path) {

        var div = this.makeElement(path);

        if (path.endCheckpoint != "gameover") {
            $(div).children('input').prop('checked', true);
        }

        $('#pathlist').append(div);
        pathlist.refreshPreview();

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

    addRemote : function (path) {

        var div = this.makeElement(path);

        $('#remotepathlist').append(div);
    },


    // if path is null, make the 'Game Start' element
    makeElement : function (path) {
        var div = document.createElement('div');

        var input = document.createElement('input');
        $(input).attr('type', 'radio')
                .attr('name','path');

        if (!path) {
            this.gameStartRadioButton = input;
        }

        var endState = undefined;
        if (path) {
            endState = path.endState;
        }

        $(input).css('display', 'none');

        div.appendChild(input);

        // set up the preview
        $(input).change(function () {
            game.load(endState);
            game.render();
        });


        $(input).bind('startPlaying', function () {
            playMode.start(path);
        });

        $(input).bind('startReplaying', function () {
            if (path) {
                replayMode.start(path);
            }
        });

        var label = document.createElement('label');
        if (path) {
            label.innerHTML = path.username + ': from ' + path.startCheckpoint +
                ' at ' + path.startTicks + ' ticks ' +
                ' to ' + path.endCheckpoint +
                ' at ' + path.endTicks + ' ticks ';
            // + (new Date(path.startTime)).toUTCString();
        } else {
            label.innerHTML = "Game Start";
        }


        $(label).click(function (){
            $(input).prop('checked', true);
            pathlist.refreshPreview();
        });

        var closebutton = document.createElement('button');
        closebutton.innerHTML = '&times;';


        if (!path) {
            $(closebutton).prop('disabled', true);
        }


        $(closebutton).click(function () {
            var parent = $(this).parent();

            if (parent.children('input').is(":checked")) {
                pathlist.selectGameStart();
            }

            parent.slideUp(100, function () {
                parent.remove();
                pathlist.refreshPreview();
            });
        })


        div.appendChild(closebutton);

        div.appendChild(input);
        div.appendChild(label);

        return div;
    },

    gameStartRadioButton : null,

    selectGameStart : function () {
        $(this.gameStartRadioButton).prop('checked', true);
        pathlist.refreshPreview();
    },

    refreshPreview : function () {
        $('[name="path"]').each (function (idx, elt) {
            if ($(elt).is(':checked')) {
                $(elt).trigger('change');
                $(elt).parent().children('label')
                   .css('border', '1px solid')
                   .css('color', '#FFFFFF');
            } else {
                $(elt).parent().children('label')
                   .css('border', 'none')
                   .css('color', '#AAAAAA');
            }
        });

    },

    playSelected : function() {
        return $('[name="path"]:checked').trigger('startPlaying');
    },

    replaySelected : function() {
        return $('[name="path"]:checked').trigger('startReplaying');
    },

    hide : function() {
        $('.pathlist').css('display','none');
    },

    show : function() {
        $('.pathlist').show();
    }
};

var replayMode = {
    start : function (path) {
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
       pathlist.refreshPreview();
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

    kdown : function(event) {
        if (event.keyCode == 13) { // ENTER
            pathlist.playSelected();
        } else if (event.keyCode == 82 /* 'r' */ ) {
            pathlist.replaySelected();
        }
    },

    menu : function () {
        stdout.innerHTML = "Press ENTER to play or 'R' to replay.";
        $(window).off('keydown keyup');
        $(window).keydown(this.kdown.bind(this));
    },

    registerPath : function (path) {
        pathlist.addLocal(path);
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
            this.path.startCheckpoint = 'start';
        }


        game.start();

        $(window).off('keyup keydown');
        $(window).keyup(this.kup.bind(this));
        $(window).keydown(this.kdown.bind(this));


        this.events = Array();
        this.ticker = window.setInterval(this.tick.bind(this), game.tickMillis);
    },

    stop : function (endCheckpoint) {
        clearInterval(this.ticker);
        pathlist.show();
        game.prestop();
        game.stop();
        if (endCheckpoint != 'abort') {
            this.path.endCheckpoint = endCheckpoint;
            this.path.events = this.events;
            this.path.endState = game.getstate();
            this.path.endTicks = this.ticks;
            this.path.key = {
                sessionID: this.sessionID,
                pathID : this.getPathID()};
            mainMode.registerPath(this.path);
        } else {
            pathlist.refreshPreview();
        }
        mainMode.menu();
    },

    tick : function () {
        game.tick();
        game.render();
        cp = game.atcheckpoint();
        if (cp) {
            console.log("at checkpoint: " + cp);
            if (cp == 'gameover' ||
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
    stdout.innerHTML = "Enter your name to begin.";
    document.getElementById('usernamebutton').focus();


    $('#leaderboardbutton').click(function () {
        $.ajax({type:'GET',
                url:'getleaderboard'})
            .done( function (data) {
                if ($('#remotepathlist div input:checked').length > 0) {
                    pathlist.selectGameStart();
                }

                $('#remotepathlist div').remove();
                var paths = JSON.parse(data);
                paths.forEach(function (p) {
                    pathlist.addRemote(p);
                    pathlist.refreshPreview();
                });

                $('#leaderboardbutton').html('refresh leaderboard');
            });
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
        $('#username').html('name: ' + username).attr('value', username);
        gotUsername.resolve();
    });

    $.when( gotSessionID, gotUsername ).done (function () {

        var div = pathlist.makeElement();
        $('#pathlist').append(div);
        $(div).children('input').prop('checked', true);

        pathlist.show();
        pathlist.selectGameStart();

        mainMode.menu();
    });




};
