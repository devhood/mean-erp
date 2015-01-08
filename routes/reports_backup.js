var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/:object/complete', function(req, res) {
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');
    req.db.collection(req.params.object)
    .find(req.query.filter,req.query.columns)
    .sort(req.query.sorting).skip(Number(req.query.page) || 0)
    .limit(Number(req.query.rows) || 0).toArray()
    .done(function(data){
      res.status(200).json(data);
    })
    .fail( function( err ) {
      console.log(err);
       res.status(400).json(err);
    });

})
.get('/:object/product', function(req, res) {
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');
    req.db.collection(req.params.object)
    .find(req.query.filter,req.query.columns)
    .sort(req.query.sorting).skip(Number(req.query.page) || 0)
    .limit(Number(req.query.rows) || 0).toArray()
    .done(function(data){

      var content = [];
      for(var i in data){

        if(data[i] && data[i].ordered_items){
          for(var j in data[i].ordered_items){
            console.log(data[i].ordered_items[j]);
            content.push({
              _id : data[i]._id,
              customer : data[i].customer.company_name,
              bl_code : data[i].ordered_items[j].bl_code,
              brand : data[i].ordered_items[j].brand,
              name : data[i].ordered_items[j].name,
              quantity : data[i].ordered_items[j].quantity
            });
          }

        }
      }
      res.status(200).json(content);
    })
    .fail( function( err ) {
      console.log(err);
       res.status(400).json(err);
    });

})
.get('/:object/brand', function(req, res) {
  console.log("branding");
    req.query.filter = JSON.parse(req.query.filter || '{}');
    req.query.columns = JSON.parse(req.query.columns || '{}');
    req.query.sorting = JSON.parse(req.query.sorting || '{}');
    req.db.collection(req.params.object)
    .find(req.query.filter,req.query.columns)
    .sort(req.query.sorting).skip(Number(req.query.page) || 0)
    .limit(Number(req.query.rows) || 0).toArray()
    .done(function(data){

      var content = [];
      for(var i in data){

        if(data[i] && data[i].ordered_items){
          for(var j in data[i].ordered_items){
            console.log(data[i].ordered_items[j]);
            content.push({
              _id : data[i]._id,
              customer : data[i].customer.company_name,
              bl_code : data[i].ordered_items[j].bl_code,
              brand : data[i].ordered_items[j].brand,
              name : data[i].ordered_items[j].name,
              quantity : data[i].ordered_items[j].quantity
            });
          }

        }
      }
      res.status(200).json(content);
    })
    .fail( function( err ) {
      console.log(err);
       res.status(400).json(err);
    });

})

module.exports = router;
