var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


// var User = {};

// db.once('open', function(){
db.userSchema = mongoose.Schema({
  username: String,
  password: String
});

db.userSchema.methods.hashPassword = function(password, cb){
  // console.log('hi')
  bcrypt.hash(password, null, null, function(err, pass){
    if(err){console.log(err); }
    this.password = pass;
    console.log(this);
    cb();
  });
};

db.userSchema.pre('save', function(next) {
  this.hashPassword(this.password, next);
});

var comparePassword = function(realPassword, attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, realPassword, function(err, isMatch) {
    if(err) {
      console.log('bcrypterr',err);
      callback(isMatch);
    }
    else {
      callback(isMatch);
    };  
  });



  // mongoose.model('User', db.userSchema).find({username: attemptedUser}, function(err, users){
  //   if(err) {
  //     console.log('user page error', err)
  //   } else {
  //     users.forEach(function(user){
  //       bcrypt.compare(attemptedPassword, user.password, function(err, isMatch) {
  //         callback(isMatch);
  //       });
  //     });
  //   }
  // });
};

var schema = mongoose.model('User', db.userSchema);
schema['comparePassword'] = comparePassword;

module.exports = schema;












// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;
