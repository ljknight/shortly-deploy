var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

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
    if(user[0]){
      User.comparePassword(user[0].password, password, function(isMatch){
        if (isMatch) {
          util.createSession(req, res, user);
          res.redirect('/');
        } else {
          res.redirect('/login');
        }
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var user = new User({
    username:username,password:password
  });

  user.save(function(err){
    if(err){
      console.log('error on saving new user', err);
      res.redirect('/login');
    }
    res.redirect('/')
  });
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
        } 
      });
    }
  });
};