function init() {
    var canvas = document.getElementById('canvas');


    $.ajax({type:'GET',
            url:'../getstates?ticks=100'
           })
    .done( function (data) {
        console.log("success!");
        console.log(data);
    })
    .fail( function (xhr, status, thrown) {
        console.log("failure");
        console.log(thrown);
    });
}