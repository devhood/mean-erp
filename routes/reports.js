var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/sales/complete', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');

  var content = {};
  content.group = {
    "_id":"$_id",
    "sono":{$first:"$sono"},
    "drno":{$first:"$drno"},
    "sino":{$first:"$sino"},
    "customer":{$first:"$customer.company_name"},
    "sales_executive":{$first:"$customer.sales_executive"},
    "payment_term":{$first:"$customer.payment_term"},
    "scity":{$first:"$customer.shipping_address.city"},
    "bcity":{$first:"$customer.billing_address.city"},
    "province":{$first:"$customer.billing_address.province"},
    "delivery_method":{$first:"$delivery_method"},
    "delivery_date":{$first:"$delivery_date"},
    "so_date":{$first:"$so_date"},
    "dr_approved_date":{$first:"$dr_approved_date"},
    "si_approved_date":{$first:"$si_approved_date"},
    "payment_date":{$first:"$payment_date"},
    "status_code":{$first:"$status.status_name"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = req.query.filter;
  req.db.collection('sales')
  // $match:{"status.status_name":"TRANSACTION COMPLETE"}
  .aggregate([{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})
.get('/sales/items', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');

  var content = {};
  content.group = {
  "_id" : "$ordered_items.bl_code",
  "name":{$first:"$ordered_items.name"},
  "bl_code":{$first:"$ordered_items.bl_code"},
  "quantity":{$sum:"$ordered_items.quantity"},
  "brand":{$first:"$ordered_items.brand"},
  };
  content.match = req.query.filter;
  // content.match = {dr_approved_date:{"$gte": "2015-02-25T14:04:54.576Z", "$lte": "2015-02-25T14:04:54.576Z"}};
  req.db.collection('sales')
  // {$match:{"status.status_name":"TRANSACTION COMPLETE"}},
  // {$group:content.group}
  .aggregate([{$match:content.match||{}},{$unwind:"$ordered_items"}])
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
  // {$match:{"status.status_name":"TRANSACTION COMPLETE"}}
  .aggregate([{$match:content.match||{}},{$group:content.group}])
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
  // {$match:{"status.status_name":"TRANSACTION COMPLETE"}},
  .aggregate([{$unwind:"$ordered_items"},{$match:content.match||{}},{$group:content.group}])
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
  // {$match:{"status.status_name":"TRANSACTION COMPLETE"}}
  .aggregate([{$unwind:"$ordered_items"},{$match:content.match||{}},{$group:content.group}])
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
  // {$match:{"status.status_name":"TRANSACTION COMPLETE"}}
  .aggregate([{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})
// .get('/sales/inventory', function(req, res) {
//   req.query.filter = JSON.parse(req.query.filter || '{}');
//   console.log("filter",req.query.filter);
//   var content = {};
//   content.project = {id : $id };
//   // bl_code" : "$bl_code" , "product" : "$product"
//   // {$project:content.project}
//   //   "_id":"$bl_code",
//   content.group = {
//     "_id":"$customer.company_name",
//     "inventory_location":{$first:"$inventories.company_name"},
//     "branch":{$first:"$inventories.branch"},
//     "quantity":{$sum:"$inventories.quantity"},
//     "rquantity":{$sum:"$inventories.rquantity"}
//   };

//   console.log(content);
//   content.match = req.query.filter;
//   req.db.collection('products')
//   .aggregate([{$match:content.match||{}},{$project:content.project}, {$group:content.group}])
//   .done(function(result){
//     console.log("result: ", result);
//     res.status(200).json(result);
//   })
//   .fail( function( err ) {
//     console.log(err);
//     res.status(400).json(err);
//   });

// })
  .get('/inventory/transaction', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  console.log("filter",req.query.filter);
  var content = {};
  // content.group = {
  //   "_id":"$item._id",
  //   "inventory_location":{$first:"$location"},
  //   "quantity":{$first:"$quantity"},
  //   "object":{$first:"$reference.object"},
  //   "value":{$first:"$reference.value"},
  //   "key":{$first:"$reference.key"},
  //   "bl_code":{$first:"$bl_code"},
  //   "brand":{$first:"$brand"},
  //   "uom":{$first:"$uom"}
  // };

  content.match = req.query.filter;
  console.log("content.match", content.match);
  req.db.collection('inv_trans_history')
  .aggregate([{$match:content.match||{}}])
  .done(function(result){
    console.log("result: ", result);
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });
})

module.exports = router;
