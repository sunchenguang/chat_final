"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var path = require('path');
var _ = require('underscore');
var errorhandler = require('errorhandler');
var mongoose = require('mongoose');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

var router = require('./routes');

app.set('port', process.env.PORT || 3000);

// app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

//db connect
var db_config = require('./config/db');
mongoose.connect(db_config.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('mongodb connect success!');
});

// development only
if ('development' == app.get('env')) {
    // app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    app.use(errorhandler())
}

// [
//  { session_id: "5W5f-HSzolBOjMj7AAAC", name: "Peter" },
//  { session_id: "YXlbm_LmHD7oUGwkAAAD", name: "Martin"}
// ]

app.use('/api', router);

// angular 页面
app.get("*", function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var participants = [];
var messages = [];

function mostRecentMessages() {
    return messages.slice(messages.length - 20, messages.length);
}

app.post("/messages", function (request, response) {
    var message = request.body.message;

    if (message && message.trim().length > 0) {
        var user_id = request.body.user_id;
        var created_at = request.body.created_at;
        var user = _.findWhere(participants, {id: user_id});

        messages.push({message: message, user: user, type: "message", created_at: created_at});

        // let our chatroom know there was a new message
        io.sockets.emit("incoming_message", _.last(messages));

        response.status(200).json({message: "Message received"});
    } else {
        return response.status(400).json({error: "Invalid message"});
    }
});

var nameCounter = 1;

io.on("connection", function (socket) {
    socket.on("new_user", function (data) {
        console.log("ON new_user", data);
        
        var newName = data.username || "Guest " + nameCounter++;
            participants.push({id: data.id, name: newName});

        console.log("messages", messages, mostRecentMessages());

        io.sockets.emit("new_connection", {
            user: {
                id: data.id,
                name: newName
            },
            sender: "system",
            created_at: new Date().toISOString(),
            participants: participants,
            messages: mostRecentMessages()
        });
    });

    socket.on("name_change", function (data) {
        console.log("ON name_change", data);

        _.findWhere(participants, {id: socket.id}).name = data.name;
        io.sockets.emit("name_changed", {id: data.id, name: data.name});
    });

    socket.on("disconnect", function () {
        var disconnect_id = socket.id.slice(2);
        console.log("ON disconnect", disconnect_id);

        var participant = _.findWhere(participants, {id: disconnect_id});
        participants = _.without(participants, participant);
        io.sockets.emit("user_disconnected", {
            user: {
                id: disconnect_id,
                name: participant.name
            },
            participants: participants,
            sender: "system",
            created_at: new Date().toISOString()
        });
    });
});

http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


module.exports = io;
