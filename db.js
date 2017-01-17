var mongodb = require('mongodb').MongoClient;
var dbUrl = (process.env['IMAGE_SEARCH_API_MODE'] == "test") ? "mongodb://localhost:27017/image-search-test" : "mongodb://localhost:27017/image-search";

var state = {
    db: null
};

var connect = function connect() {
    return new Promise(function (resolve, reject) {
        // Close the current database connection if it exists
        if (state.db) {
            state.db.close();
        }
        mongodb.connect(dbUrl, function (err, db) {
            if (err) {
                reject(err);
            }
            console.log("Connected to MongoDB url: " + dbUrl);
            state.db = db;
            resolve(state.db);
        });
    });
};

var get = function get() {
    return state.db;
};

var close = function close(done) {
    if (state.db) {
        state.db.close();
    }
};

var clearCollection = function clearCollection(collectionName) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database unavailable");
        }
        var collection = state.db.collection(collectionName);
        // First, insert a record. This insures that the collection will exist when we drop it later.
        collection.insertOne({"test":"test"})
            .then(() => collection.drop())
            .then(() => resolve())
            .catch(err => reject(err));
    });
};


// Set up module exports
module.exports.connect = connect;
module.exports.get = get;
module.exports.close = close;
module.exports.clearCollection = clearCollection;