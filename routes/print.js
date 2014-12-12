var express = require('express');
var router = express.Router();
var printer = require('../lib/printing.js');
var mongoq = require("mongoq");

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
        res.status(200).json(data[0]);
     //   res.redirect(filename);
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
     //   res.status(200).json(data[0]);
        res.redirect(filename);
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
