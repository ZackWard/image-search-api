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

var addSearchRecord = function addSearchRecord(query) {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database unavailable");
        }
        var searchRecord = {
            term: query,
            when: new Date()
        };
        state.db.collection('searches').insertOne(searchRecord)
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
};

var getSearchHistory = function getSearchHistory() {
    return new Promise(function (resolve, reject) {
        if (state.db == null) {
            return reject("Database unavailable");
        }
        state.db.collection('searches').find({})
            .sort({"when": -1})
            .limit(10)
            .project({"_id": 0})
            .toArray().then((docs) => {
                docs = docs.map((item) => {
                    item.when = item.when.toString();
                    return item;
                });
                resolve(docs);
            }).catch((e) => reject(e));
    });
};


// Set up module exports
module.exports.connect = connect;
module.exports.get = get;
module.exports.close = close;
module.exports.clearCollection = clearCollection;
module.exports.addSearchRecord = addSearchRecord;
module.exports.getSearchHistory = getSearchHistory;