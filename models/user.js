/**
 * Created by scg on 16-5-22.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
// mongoose schema
var UserSchema = new Schema({
    name: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
});

//密码加盐后保存
UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.statics.findByName = function (name, cb) {
    return this.find({
        name: name
    }, cb);
};


UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// model
var User = mongoose.model('User', UserSchema);

module.exports = User;

