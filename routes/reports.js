var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/sales/complete', function(req, res) {
  req.query.filter = JSON.parse(req.query.filter || '{}');
  console.log("req.query.filter: " + JSON.stringify(req.query.filter));

  var content = {};
  content.group = {
    "_id":"$sino",
    "sino":{$first:"$sino"},
    "customer":{$first:"$customer.company_name"},
    "sales_executive":{$first:"$customer.sales_executive"},
    "payment_term":{$first:"$customer.payment_term"},
    "delivery_method":{$first:"$delivery_method"},
    "delivery_date":{$first:"$delivery_date"},
    "status_code":{$first:"$status.status_name"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = req.query.filter;
  console.log("content.match: "+JSON.stringify(content.match));
  req.db.collection('sales')
  .aggregate([{$match:content.match||{}},{$group:content.group}])
  .done(function(result){
    console.log(result);
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})

module.exports = router;
