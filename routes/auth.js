var express = require('express');
var router = express.Router();
var passport = require('passport');


var ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
};

var hasAuthorization = function(req, res, next) {

    //  return res.send(403);
    next();
};

router.get('/login',function(req,res){
  res.render('login',{message : req.flash('error')[0]});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) { res.redirect("/auth/login") }
    else{
      req.logIn(user, function(err) {
        if (err) {
          return res.send(err);
        }
        else{
          res.redirect("/");
        }

      });
    }

  })(req, res, next);
});

router.get('/logout', function(req,res){
  if(req.user){
    req.session.destroy();
    req.logout();
    res.redirect("/");
  }
  else{
    res.send(400,'Not logged in');
  }
});

router.get('/session',ensureAuthenticated,function(req,res){
  delete req.user.password;
  res.json(req.user);
})

module.exports = router;
