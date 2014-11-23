var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoq = require('mongoq');
var db = module.parent.exports.db;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    db.collection('users')
      .find({username:username,password:password})
      .toArray()
      .done(function(data){
        if(!data[0]){
          return done({
            'errors':  'Authentication Failed.'
          });
        }
        else{
          return done(null,data[0]);
        }
      })
      .fail( function( err ) {
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(id);
  db.collection('users')
    .find({_id:id})
    .toArray()
    .done(function(data){
      done(null,data[0]);
    })
    .fail( function( err ) {
      done(err);
    });
});
