var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // console.log('I AM ALIVE');
  // Links.reset().fetch().then(function(links) {
  //   res.send(200, links.models);
  // })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  // make sure to create code



  Link.create({url: uri/*, base_url: req.headers.origin*/}, function(err, url) {
    util.getUrlTitle(uri, function(err, title) {
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }
      url.update({title: title}, function(err, u){
        if(err){
          console.log('error doing update on url', err)
          return res.send(404);
        }
        
        res.send(200, url);
      });
    });
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, user){
    
    console.log(user[0].password);
    // users.forEach(function(user){
      User.comparePassword(user[0].password, password, function(err, isMatch){
        console.log('match',isMatch);

        if(err){console.log('bcrypt error: ', err)}
        if (isMatch) {
          
          util.createSession(req, res, user);
          res.redirect('/');
        } else {

          res.redirect('/login');
        }
      });
    // });
  });

  // User.find({username: username}).exec(function(err, user) {
  //   if(!user){
  //     res.redirect('/login')
  //   } else { 
  //     User.comparePassword(password, function(isMatch){
  //       if (isMatch) {
  //         util.createSession(req, res, user);
  //       } else {
  //         res.redirect('/login');
  //       }
  //     })
  //   }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.create({username:username,password:password}, function(err, user){
    res.redirect('/');
  })
};

exports.navToLink = function(req, res) {

  var query = Link.find({code:req.params[0]}, function(err,link){
    if(err){console.log(err);}
    else {
      link.forEach(function(l) {
        if(l.url) {
          l.update({visits: l.visits+1}, function(){
            res.redirect(l.url);
          });

          // res.redirect(l.url);
        } 
      });
    }
  });
  // query.exec(function(err, link){
  //   console.log(link);
  //   if(err){
  //     console.log("error link select 99", err)
  //   } else {
  //     link.update({visits: link.visits+1}, function(){
  //       res.redirect(link.url);
  //     });
  //   }
  // });



  // Link.create({code: req.params[0]}, function(err, link){
  //   if(!link){
  //     res.redirect('/');
  //   } else {
  //     link.update({visits: link.visits+1}, function(){
  //       res.redirect(link.url);
  //     });
  //   }
  // })

  // Link.create({code: req.params[0]}, function(err, link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.update({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};