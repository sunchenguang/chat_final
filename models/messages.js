/**
 * Created by scg on 16-5-25.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Message = new Schema({
    room_id: String,
    user_id: String,
    body: String,
    created: {type: Date, default: Date.now}
});

Message.statics.allFrom = function (roomid, callback) {
    MessageModel
        .where('roomid', roomid)
        .exec(callback);
};

Message.methods.publicFields = function () {
    return {
        userid: this.userid,
        roomid: this.roomid,
        body: this.body


    };
};

var MessageModel = mongoose.model('Message', Message);

module.exports = MessageModel;

