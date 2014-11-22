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
    console.log(username,password);
    db.collection('users')
      .find({username:username,password:password})
      .toArray()
      .done(function(data){
        if(!data[0]){
          console.log("data nok",data);
          return done({
            'errors':  'Authentication Failed.'
          });
        }
        else{
          console.log("data ok",data);
          return done(null,data[0]);
        }
      })
      .fail( function( err ) {
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  console.log("user",user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log("id",id);
  id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(id);
  db.collection('users')
    .find({_id:id})
    .toArray()
    .done(function(data){
      console.log("data",data[0]);
      done(null,data[0]);
    })
    .fail( function( err ) {
      done(err);
    });
});
