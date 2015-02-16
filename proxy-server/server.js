'use strict';

// -----------------------------------------------------------------------------
// Start the HTTP Server
// -----------------------------------------------------------------------------
var port = 8080;

var express = require('express');
var app = express();

// Serve static content from the public directory
app.use('/', express.static(__dirname + '/../src'));

// Add rewrite rules
var modRewrite = require('connect-modrewrite');
app.use(modRewrite([
    '^/bfexch-javaee/(.*)$ http://apps.archfirst.org/bfexch-javaee/$1 [P]',
    '^/bfoms-javaee/(.*)$ http://apps.archfirst.org/bfoms-javaee/$1 [P]'
    ]));

var server = require('http').createServer(app);

// Start listening to HTTP requests
server.listen(port, function() {
    console.log('Listening on port ' + port);
});

// -----------------------------------------------------------------------------
// Stop the HTTP server and the database when SIGINT is received
// (i.e. Ctrl-C is pressed)
// -----------------------------------------------------------------------------
process.on('SIGINT', function() {
    console.log('\nSIGINT received ...');
    server.close(function() {
        console.log('Server stopped ...');
        console.log('Exiting process ...');
        process.exit();
    });
});