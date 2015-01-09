var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/sales/complete', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');

  var content = {};
  content.group = {
    "_id":"$sino",
    "sino":{$first:"$sino"},
    "customer":{$first:"$customer.company_name"},
    "sales_executive":{$first:"$customer.sales_executive"},
    "payment_term":{$first:"$customer.payment_term"},
    "delivery_method":{$first:"$delivery_method"},
    "delivery_date":{$first:"$delivery_date"},
    "payment_date":{$first:"$payment_date"},
    "status_code":{$first:"$status.status_name"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  .aggregate([{$match:{"status.status_name":"TRANSACTION COMPLETE"}},{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})
.get('/sales/customer', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  var content = {};
  content.group = {
    "_id" : {customer:"$customer.company_name"},
    "customer":{$first:"$customer.company_name"},
    "branch":{$first:"$customer.branch"},
    "type":{$first:"$customer.type"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  .aggregate([{$match:{"status.status_name":"TRANSACTION COMPLETE"}},{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})
.get('/sales/product', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  var content = {};
  content.group = {
    "_id" : "$ordered_items.bl_code",
    "name":{$first:"$ordered_items.name"},
    "bl_code":{$first:"$ordered_items.bl_code"},
    "quantity":{$sum:"$ordered_items.quantity"},
    "brand":{$first:"$ordered_items.brand"},
    "total":{$sum:"$ordered_items.total"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  .aggregate([{$match:{"status.status_name":"TRANSACTION COMPLETE"}},{$unwind:"$ordered_items"},{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})
.get('/sales/brand', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  var content = {};
  content.group = {
    "_id" : "$ordered_items.brand",
    "brand":{$first:"$ordered_items.brand"},
    "quantity":{$sum:"$ordered_items.quantity"},
    "total":{$sum:"$ordered_items.total"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  .aggregate([{$match:{"status.status_name":"TRANSACTION COMPLETE"}},{$unwind:"$ordered_items"},{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });
})
.get('/sales/se', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  var content = {};
  content.group = {
    "_id" :"$customer.sales_executive",
    "sales_executive":{$first:"$customer.sales_executive"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  .aggregate([{$match:{"status.status_name":"TRANSACTION COMPLETE"}},{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})

module.exports = router;
