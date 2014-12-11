'use strict';

var http       = require('http');
var express    = require('express');
var bodyParser = require('body-parser');
var path       = require('path');
var app        = express();
var server     = http.Server(app);
var io         = require('socket.io')(server);
var channel    = require('./lib/channel');
var router     = require('./lib/router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', require('./lib/io'));
router(app, io, channel);

server.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});