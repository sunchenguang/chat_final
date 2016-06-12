/**
 * Created by scg on 16-5-25.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Room = new Schema({
    name: String,
    created: {type: Date, default: Date.now}
});


Room.statics.findByName = function (name, cb) {
    return this.find({
        name: name
    }, cb);
};

Room.statics.exist = function (roomid, callback) {
    RoomModel.count({id: roomid}, callback);
};

Room.statics.fetchAll = function (cb) {
    RoomModel.find({}, function (err, rooms) {
        cb(err, rooms);
    });

};


Room.methods.publicFields = function () {
    return {
        id: this.id,
        name: this.name,
        created: this.created
    };
};


// model
var RoomModel = mongoose.model('Room', Room);

module.exports = RoomModel;
