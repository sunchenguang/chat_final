/**
 * Created by scg on 16-5-22.
 */
var User = require('./models/user');
var Message = require('./models/messages');
var Room = require('./models/rooms');

// var io = require('./app');
var express = require('express');
var router = express.Router();
var _ = require('underscore');


// /api/users  get是获取所有users
router.route('/users')
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.json({
                    "result": "Get users error!"
                });
            }
            res.json(users);
        });
    });

// /api/user  post是新建用户 put时更新用户   delete是删除用户
router.route('/user')
    .post(function (req, res) {
        var user = req.body;
        var newUser = new User({
            name: user.name,
            password: user.password
        });
        newUser.save(function (err, data) {
            if (err) {
                res.json({
                    "result": "fail"
                });
            } else {
                res.json({
                    "result": "success"
                });
            }
        });
    })
    .put(function (req, res) {
        var id = req.body.id;
        var name = req.body.name;
        User.findById(id, function (err, user) {
            if (err) {
                res.json({
                    "result": "find record error"
                });
            }
            user.name = name;

            user.save(function (err) {
                if (err) {
                    res.json({
                        "result": "update record error"
                    });
                }

                res.json({"result": "success"});
            });


        });

    })
    .delete(function (req, res) {
        var name = req.body.name;
        User.remove({
            name: name
        }, function (err, user) {
            if (err) {
                res.json({
                    "result": "remove user " + name + "failed"
                });
            }
            res.json({
                "result": "success"
            });
        })
    });


router.route('/rooms').get(function (req, res) {
    Room.fetchAll(function (err, rooms) {
        if (err) {
            console.log('err');
        } else {
            if (rooms) {
                res.json({
                    "result": rooms
                })
            } else {
                res.json({
                    "result": "fail"
                })
            }
        }
    });


});


router.route('/addRoom').post(function (req, res) {
    var room_name = req.body.room_name;

    Room.findByName(room_name, function (err, rooms) {
        if (rooms.length > 0) {
            res.json({
                "result": "房间名已注册！"
            });
        } else {
            var roomInstance = new Room({
                name: room_name
            });
            roomInstance.save(function (err) {
                if (err) {
                    res.json({
                        "result": "fail"
                    })
                }
                res.json({
                    "result": "success"
                })
            })
        }

    });
});

router.route('/user/addMessage').post(function (req, res) {
    var room_id = req.body.room_id;
    var user_id = req.body.user_id;
    var content = req.body.content;

    var msgInstance = new Message({
        room_id: room_id,
        user_id: user_id,
        body: content
    });
    msgInstance.save(function (err) {
        if (err) {
            console.log(err);
            res.json({
                "result": "user add message error"
            });
        }
        console.log('success');
        res.json({"result": "success"});
    });
});


router.route('/user/exist').post(function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    User.findByName(name, function (err, users) {
        // records为数组
        if (users.length > 0) {
            users[0].comparePassword(password, function (err, isMach) {
                if (err) {
                    console.log('compare password error happend' + err);
                }
                if (isMach) {
                    res.json({
                        "result": "success",
                        "user": users[0]
                    });
                } else {
                    res.json({
                        "result": "密码错误！"
                    });
                }
            })
        } else {
            res.json({
                "result": "用户名不存在！"
            })

        }
    });
});


//维护一个participants数组
/*
 participants = [{
 id: 'KtYasWYT7_9unypBAAAB',
 name: 'Anonymous'
 },{
 ...
 }]

 */
// console.log('io---------'+io);
// var participants = [];
//传回前端全部的用户数组数据，更新angular的数据
// io.on("connection", function (socket) {
//     socket.on("newUser", function (data) {
//         participants.push({
//             id: data.id,
//             name: data.name
//         });
//         io.sockets.emit("newConnection", participants);
//     });
//
//     socket.on("nameChange", function (data) {
//         //在participants对象数组中找到id为data.id的对象
//         var participant = _.findWhere(participants, {id: data.id});
//         participant.name = data.name;
//         io.sockets.emit("nameChanged", {
//             id: data.id,
//             name: data.name
//         });
//     });
//     socket.on("disconnect", function () {
//         //从participants数组中移除对应的participant对象
//         var disconnect_id = socket.id.slice(2);
//         var participant = _.findWhere(participants, {id: disconnect_id});
//         participants = _.without(participants, participant);
//
//         console.log('one disconnect then ' + participants);
//         io.sockets.emit("userDisconnected", {
//             "participants": participants
//         });
//     });
//
//     socket.on('error', function (msg) {
//         console.log('client io error ' + msg);
//     });
//
//
// });

module.exports = router;
