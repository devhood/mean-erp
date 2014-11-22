var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var config = require('./config.local.js');
var mongoq = require('mongoq');
var flash = require('connect-flash');

var db = exports.db = mongoq(config.mongo_url,{auto_reconnect: true});

require('./lib/passport');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'devhood',
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    url: config.mongo_url,
    collection : 'sessions'
  })

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.get('/',function(req,res){
  res.render('dashboard',{});
});
app.get('/partials/:module/:page',function(req,res){
  res.render('partials/'+req.params.module+'/'+req.params.page,{});
});

module.exports = app;
