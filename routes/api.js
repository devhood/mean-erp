var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var config = require('../config.local.js');
var path = require('path');
var fs = require('fs');

var db = module.parent.exports.db;

router.get('/:object', function(req, res) {
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');

    db.collection(req.params.object)
    .find(req.query.filter,req.query.columns)
    .sort(req.query.sorting).skip(req.query.page || 0)
    .limit(req.query.rows || 0).toArray()
    .done(function(data){
      res.status(200).json(data);
    })
    .fail( function( err ) {
       res.status(400).json(err);
    });

});

router.post('/:object', function(req, res) {
    db.collection(req.params.object)
      .insert(req.body, {safe: true})
      .done(function(data){
        res.status(200).json(data[0]);
      })
      .fail( function( err ) {
        res.status(400).json(err);
      });
});

router.get('/:object/:id', function(req, res) {
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');
    req.query.filter._id = id;
    db.collection(req.params.object)
      .find(req.query.filter,req.query.columns || {})
      .sort(req.query.sorting || {}).skip(req.query.page || 0)
      .limit(req.query.rows || 0).toArray()
      .done(function(data){
        res.status(200).json(data[0]);
      })
      .fail( function( err ) {
        res.status(400).json(err);
      });
});

router.put('/:object/:id/upload',multipartMiddleware, function(req, res) {
  var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
  if(req.files){
    for( var i in req.files){
        var temp_path = req.files[i].path;
        var file_name = req.files[i].originalFilename;
        var upload_path = __dirname.replace('routes',"") + config.upload_path + req.params.object + path.sep + file_name;
        req.query.filter = {_id : id};
        req.content = {};
        req.content[i] =  req.params.object + path.sep + file_name;
        fs.rename(temp_path, upload_path, function(err){
            if(err){
              res.status(400).json(err);
            }
            else{
              db.collection(req.params.object)
              .update(req.query.filter, {"$set" : req.content}, {safe: true})
              .done(function(data){

                res.status(200).json(data);
              })
              .fail( function( err ) {
                res.status(400).json(err);
              });
            }
        });


    }
  }
  else{
    res.status(400).json({"message": "No files uploaded"});
  }

});
router.put('/:object/:id',multipartMiddleware, function(req, res) {
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
    delete req.body._id;
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');
    req.query.filter._id = id;
    db.collection(req.params.object)
      .update(req.query.filter, {"$set" : req.body}, {safe: true})
      .done(function(data){
        res.status(200).json(data);
      })
      .fail( function( err ) {
        res.status(400).json(err);
      });
});

router['delete']('/:object/:id', function(req, res) {
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.filter._id = id;
    db.collection(req.params.object)
      .remove(req.query.filter, {safe: true})
      .done(function(data){
        res.status(200).json(data);
      })
      .fail( function( err ) {
        res.status(400).json(err);
      });
});

module.exports = router;
