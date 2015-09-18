var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

db.urlSchema = mongoose.Schema({
  url : String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

db.urlSchema.methods.makeCode = function(){
  this.code = crypto.createHash('sha1').digest('hex').slice(0,5);
};

db.urlSchema.pre('save', function(next) {
  this.makeCode();
  next();
})
  
module.exports = mongoose.model('Url', db.urlSchema);


