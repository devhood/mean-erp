var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/sales/complete', function(req, res) {

  var content = {};
  content.group = {
    "_id":"$sino",
    "sino":{$first:"$sino"},
    "customer":{$first:"$customer.company_name"},
    "total_amount_due":{$sum:"$total_amount_due"}
  };
  content.match = JSON.parse(req.query.filter || '{}');
  req.db.collection('sales')
  .aggregate([{$group:content.group},{$match:content.match||{}}])
  .done(function(result){
    res.status(200).json(result);
  })
  .fail( function( err ) {
    console.log(err);
    res.status(400).json(err);
  });

})

module.exports = router;
