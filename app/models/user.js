var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

db.userSchema = mongoose.Schema({
  username: String,
  password: String
});

db.userSchema.pre('save', function(next){
  var bcryptPromise = Promise.promisify(bcrypt.hash);
  bcryptPromise(this.password, null, null).bind(this)
    .then(function(hash){
      this.password = hash;
      next();
    });
})

var comparePassword = function(realPassword, attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, realPassword, function(err, isMatch) {
    if(err) {
      console.log('bcrypterr',err);
      callback(isMatch);
    }else {
      callback(isMatch);
    };  
  });
};

var schema = mongoose.model('User', db.userSchema);
schema['comparePassword'] = comparePassword;

module.exports = schema;
