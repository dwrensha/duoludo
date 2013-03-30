var MongoClient = require('mongodb').MongoClient;

function connect (f) {
    MongoClient.connect("mongodb://localhost:27017/duoludo", f);
}

function addPath (pathString) {
    path = JSON.parse(pathString);

    // TODO some basic validation of the path

    connect(function(err, db) {
        if (err) {
            return console.dir(err);
        } else {
            console.log("successfully connected to mongoDB");
        }

        db.collection('paths', function (err, collection) {
            collection.insert(path, {w:1}, function (err, collection) {
                db.close();
                if (err) {
                    console.log('error');
                    return console.dir(err);
                } else {
                    console.log("sucessfully inserted path");
                }
            } );
        });
    });
}


exports.addPath = addPath;