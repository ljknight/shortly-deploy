var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');





  db.urlSchema = mongoose.Schema({
    url : String,
    base_url: String,
    code: makeCode(),
    title: String,
    visits: Integer
  });

  var makeCode = function(){
    var shasum = crypto.createHash('sha1');
    return shasum.digest('hex').slice(0,5)
  };



  module.exports = mongoose.model('Url', db.urlSchema);











// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Url;
