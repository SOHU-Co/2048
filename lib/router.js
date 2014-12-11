'use strict';

var uuid = require('node-uuid');
var db = require('./db').db;
var names = [ '小苹果🍎', '路人甲', '天青色', '等烟雨', '路飞', '钢铁侠', '绿巨人', '蛇精猫', '小狐', '牛郎', '织女', '方便面', '必胜客', '马拉松'];
var count = 0;

module.exports = function (app, channel) {
    app.post('/observe', function(req, res) {
        var alias = req.body.alias || '匿名';
        if ( !req.body.comment )
            return res.send({result:false});
         var message = {
            alias : alias,
            comment : req.body.comment
        }
        //io.emit('comment', message);
        channel.dashboard.lpush('comment', JSON.stringify(message));
        return res.send({result:true});
    });

    app.get('/join', function (req, res) {
        var uid = uuid.v4();
        var username = names[count++%names.length];
        db.sadd('2048:users', uid, function () {
            db.set('2048:users:' + uid, username);
        });
        res.redirect('2048.html?uid=' + uid + '&username=' + username);
    });

    app.post('/emoji', function(req, res) {
        var mo = req.body.mo || '^^';
        if ( !req.body.uid )
            return res.send({result:false});
        var message = {
            uid : req.body.uid,
            mo : req.body.mo
        }
        //io.emit('emoji', message);
        channel.dashboard.lpush('emoji', JSON.stringify(message));
        return res.send({result:true});
    })
}