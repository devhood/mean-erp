var async = require("async");
var mongoq = require('mongoq');

var stock_piling = function(req,items){
  var stock_pile = {};
  var stock_pile_arr =[];
  for(var i=0;i<items.length; i++){
    if(items[i].uom == "Package"){
      var pitems = items[i].packages;
      for(var j=0;j<pitems.length; j++){
        if(stock_pile[pitems[j]._id]){
          stock_pile[pitems[j]._id].quantity+= (items[i].quantity * pitems[j].quantity);
        }
        else{
          stock_pile[pitems[j]._id] = {
            location : req.body.inventory_location,
            quantity : items[i].quantity * pitems[j].quantity,
            _id : pitems[j]._id
          }
        }
      }
    }
    else {
      if(stock_pile[items[i]._id]){
        stock_pile[items[i]._id].quantity+=items[i].quantity;
      }
      else{
        stock_pile[items[i]._id] = {
          location : req.body.inventory_location,
          quantity : items[i].quantity,
          _id : items[i]._id
        }
      }
    }
  }
  for(var i in stock_pile){
    stock_pile_arr.push(stock_pile[i]);;
  }
  return stock_pile_arr;
};
module.exports = {
  check : function(req,res,next){
    if(req.body.triggerInventory){
      if(req.body.ordered_items){
        var stock_pile = {};
        var stock_pile_arr =[];
        var items = req.body.ordered_items;
        var stock_pile_arr = stock_piling(req,items);
        var stock_availability = [];
        req.stock = {};
        async.eachSeries(stock_pile_arr,function(item,callback){
          var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
          var error_message;
          req.db.collection("products")
          .find({
            _id : id,
            inventories : {"$elemMatch" : { _id: item.location, quantity : {"$gte": item.quantity}}}}).toArray()
            .done(function(data){

              if(!data[0]){
                item.error_message = "INSUFFICIENT_STOCK";
                callback(item);
              }
              else{
                item.quantity = (item.quantity * -1)
                stock_availability.push(item);
                callback();
              }

            });

          },function(err){
            if(err){
              res.status(400).json(item);
            }
            else{
              req.stock.available = stock_availability
              console.log(req.stock);
              next();
            }

          })
        }
        else{
          next();
        }
      }
      else{
        next();
      }
    },
    deduct : function(req,res,next){
      if(req.stock && req.stock.available){
        var stock = req.stock.available;
        async.eachSeries(stock,function(item,callback){
          var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
          req.db.collection("products")
          .update({_id : id, "inventories._id":item.location}, {"$inc":{"inventories.$.quantity":item.quantity}}, {safe: true})
          .done(function(data){
            console.log("SUCCESS",data);
            callback();
          })
          .fail( function( err ) {
            item.error_message = "DATABASE_INSERTION_ERROR";
            callback(item);
          });
        },function(err){
          if(err){
            res.status(400).json(item);
          }
          else{
            next();
          }
        });
      }
      else{
        next();
      }
    }
  };
