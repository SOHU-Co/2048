function Tunnel () {
    this.setup();
}

Tunnel.prototype.setup = function () {
    var self = this;
    var username = window.location.href.match(/.+username=(.+)/) && window.location.href.match(/.+username=(.+)/)[1];
    var uid = window.location.href.match(/.+uid=(.+)&/) && window.location.href.match(/.+uid=(.+)&/)[1];
    var socket = this.socket  = io();
    document.querySelector('.title').innerText = decodeURI(username);
    socket.on('connect', function () {
        console.log('socket tunnel connecting now!');
        socket.emit('login', uid);
    });
    socket.on('start game', function () {})
}

Tunnel.prototype.move = function (action) {
    this.socket.emit('move', action);
    console.log('socket moveing', action);
}
