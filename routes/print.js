var express = require('express');
var router = express.Router();
var printer = require('../lib/printing.js');
var mongoq = require("mongoq");
var path = require('path');

router
.get('/sales/delivery/:id',function(req,res){
  var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
  req.query.filter = JSON.parse(req.query.filter || '{}');
  req.query.filter._id = id;
  req.db.collection('sales')
  .find(req.query.filter)
  .toArray()
  .done(function(data){
    printer.printDR(data[0],function(err,filename){
      setTimeout(function(){
       console.log(filename);
       console.log(__dirname);
       var directory = __dirname.replace("routes","public") + filename;
       res.download(directory);
      }, 1000);

    });
  })
  .fail( function( err ) {
    res.status(400).json(err);
  });
})
.get('/sales/invoice/:id',function(req,res){
var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
  req.query.filter = JSON.parse(req.query.filter || '{}');
  req.query.filter._id = id;
  req.db.collection('sales')
  .find(req.query.filter)
  .toArray()
  .done(function(data){
    printer.printSI(data[0],function(err,filename){
      setTimeout(function(){
        console.log("filename", filename);
        console.log("dirname", __dirname);
        var directory=__dirname.replace("routes","public") + filename;
        res.download(directory);
      }, 1000);

    });
  })
  .fail( function( err ) {
    res.status(400).json(err);
  });
})
.get('/sales/proforma/:id',function(req,res){
  var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
  req.query.filter = JSON.parse(req.query.filter || '{}');
  req.query.filter._id = id;
  req.db.collection('sales')
  .find(req.query.filter)
  .toArray()
  .done(function(data){
    printer.printPF(data[0],function(err,filename){
      setTimeout(function(){
        var directory=__dirname.replace("routes","public") + filename;
        res.download(directory);
      }, 1000);

    });
  })
  .fail( function( err ) {
    res.status(400).json(err);
  });
})
.get('/sales/consignment',function(req,res){

})

module.exports = router;
