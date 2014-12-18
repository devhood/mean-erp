var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');

router
.get('/:object', function(req, res) {
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

          content.push({
          // data[i].sono,
          // data[i].drno,
          // data[i].sino,
          // data[i].pfno,
          // data[i].rmrno,
          // data[i].cmno
         });
      }
      res.status(200).json(content);
    })
    .fail( function( err ) {
      console.log(err);
       res.status(400).json(err);
    });

})

module.exports = router;
