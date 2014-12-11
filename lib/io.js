'use strict';

var redis = require('redis');
var db = require('./db').db;

module.exports = function (socket) {
    console.log('New socket.io client connected!');
    var parsed = require('url').parse(socket.request.url);
    var query = require('querystring').parse(parsed.query);
    if (query.dashboard) {
        socket.join('dashboard');
    } else {
        socket.join('player', function (err) {
            socket.on('move', move);
            socket.on('login', login);
        });
    }
    
    function move (action) {
        if (!socket.uid) return;
        action.uid = socket.uid;
        action.username = socket.username;
        socket.to('dashboard').emit('move', action);
    }

    function login (uid) {
        db.sismember('2048:users', uid, function (err, exsits) {
            if (err || !exsits) return socket.disconnect();
            if (!socket.uid) socket.to('dashboard').emit('login', uid);
            db.get('2048:users:' + uid, function (err, name) {
                socket.username = name;
            });
            socket.uid = uid;
        });
    }
}