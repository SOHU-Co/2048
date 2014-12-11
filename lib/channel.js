'use strict';

var redis = require('redis');
var db = require('./db').db;
var crypto = require('crypto');
var md5;

var optionsDashboard = [
  '1e9r71x70q',
  'b3fa44e759e691428833ed88bc6794466f1a23d9',
  '1418265428455',
  'test,login,move,emoji,comment'
];
md5 = crypto.createHash('md5');
md5.update(optionsDashboard.join(':'));
var token = md5.digest('hex');
console.log('tokenDashboard: ',token);

var optionsGame = [
  '1e9us3io0n',
  'f42cf9f51728dafc235b1efe76d77b3ac21a9704',
  '1418277755357',
  'test,login,move,emoji,comment'
];
md5 = crypto.createHash('md5');
md5.update(optionsGame.join(':'));
var token = md5.digest('hex');
console.log('tokenGame: ',token);


var clientGame = redis.createClient(8359, '10.16.33.62'),
    clientDashboard = redis.createClient(8359, '10.16.33.62');
clientGame.auth(optionsGame[0]+':'+optionsGame[1]);
clientDashboard.auth(optionsDashboard[0]+':'+optionsDashboard[1]);

clientGame.subscribe('@');
clientGame.on('message', function (channel, message) {
  var obj = JSON.parse(message);
  if(obj['login']) {
    var uid = obj['login'];
    db.sismember('2048:users', uid, function (err, exsits) {
      if (err || !exsits) return ;  
      db.get('2048:users:' + uid, function (err, name) {
        obj['login'].username = name;
        console.log('game login', uid);
        clientDashboard.lpush('login', JSON.stringify(obj));
      });
    });
  }
  else if(obj['move']) {
    console.log('game move', obj['move'].uid);
    clientDashboard.lpush('move', message);
  }
});

console.log('New channel client connected!');

module.exports.game = clientGame;
module.exports.dashboard = clientDashboard;