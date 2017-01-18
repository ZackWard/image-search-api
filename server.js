var express = require('express');
var app = express();
var routes = require('./routes');
var helmet = require('helmet');
var mongoSanitize = require('express-mongo-sanitize');
var db = require('./db');

var port = 3003;

// Set up Express middleware
app.use(helmet());
app.use(mongoSanitize());
app.use('/static', express.static('public'));

// Set up routes
app.use(routes);

// Start server
db.connect()
    .then((db) => {
        app.listen(port, 'localhost', function () {
            console.log("Express listening on port " + port);
        });
    })
    .catch((e) => {
        console.log("Error: " + e);
        process.exit(1);
    });

module.exports = app;