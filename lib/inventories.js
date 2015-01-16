var async = require("async");
var mongoq = require('mongoq');

var getPreviousRecord = function(db,collection,filter,callback){

  db.collection(collection)
  .find(filter).toArray()
      .done(function(data){

      if(data && data.length){
        console.log("has previous");
        callback(null,data[0]);
      }
      else{
        console.log("dont have previous");
        callback(null,null);
      }
    });
};


var checkStock = function(db,location,items,done){
    var aItems = arrangeItems(items);
    async.eachSeries(aItems,
      function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        checkItemInventory(db,location,item,callback);
      },
      function(err){
        done(err,aItems);
      });
};
var checkStockReserve = function(db,location,items,done){
    var aItems = arrangeItems(items);
    async.eachSeries(aItems,
      function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        checkItemInventory(db,location,item,callback);
      },
      function(err){
        done(err,aItems);
      });
};


var outStock = function(db,location,items,cb){
  checkStock(db,location,items,function(err,items){
    if(err){
      cb(err);
    }
    else{
      async.eachSeries(items,function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        var quantity = item.quantity * -1;
        db.collection("products")
        .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":quantity}}, {safe: true})
        .done(function(data){
          callback();
        })
        .fail( function( err ) {
          item.error_message = "DATABASE_INSERTION_ERROR";
          callback(item);
        });
      },function(err){
        if(err){
          cb(err);
        }
        else{
          cb();
        }
      });
    }
  });
};
var outStockReserve = function(db,location,items,cb){
  checkStock(db,location,items,function(err,items){
    if(err){
      cb(err);
    }
    else{
      async.eachSeries(items,function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        var rquantity = item.quantity * -1;
        db.collection("products")
        .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.rquantity":rquantity}}, {safe: true})
        .done(function(data){
          callback();
        })
        .fail( function( err ) {
          item.error_message = "DATABASE_INSERTION_ERROR";
          callback(item);
        });
      },function(err){
        if(err){
          cb(err);
        }
        else{
          cb();
        }
      });
    }
  });
};

var inStock = function(db,location,items,cb){
 var aItems = arrangeItems(items);
  async.eachSeries(aItems,function(item,callback){
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
    var quantity = item.quantity;
    db.collection("products")
    .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":quantity}}, {safe: true})
    .done(function(data){
      callback();
    })
    .fail( function( err ) {
      item.error_message = "INSTOCK DATABASE_INSERTION_ERROR";
      callback(item);
    });
  },function(err){
    if(err){
      cb(err);
    }
    else{
      cb();
    }
  });
};
var inStockReserve = function(db,location,items,cb){
 var aItems = arrangeItems(items);
  async.eachSeries(aItems,function(item,callback){
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
    var rquantity = item.quantity;
    db.collection("products")
    .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.rquantity":rquantity}}, {safe: true})
    .done(function(data){
      callback();
    })
    .fail( function( err ) {
      item.error_message = "INSTOCK DATABASE_INSERTION_ERROR";
      callback(item);
    });
  },function(err){
    if(err){
      cb(err);
    }
    else{
      cb();
    }
  });
};




var checkItemInventory = function(db,location,item,callback){
  var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
  db.collection("products")
  .find({
    _id : id,
    inventories : {"$elemMatch" : { _id: location, quantity : {"$gte": item.quantity}}}}).toArray()
      .done(function(data){
      if(data && data.length){
        callback(null,{
          item : item,
          location : location,
          status : "SUFFICIENT_STOCK"
        });
      }
      else{
        callback({
          item : item,
          location : location,
          status : "INSUFFICIENT_STOCK"
        });
      }
    });
};
var checkItemInventoryReserve = function(db,location,item,callback){
  var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
  db.collection("products")
  .find({
    _id : id,
    inventories : {"$elemMatch" : { _id: location, quantity : {"$gte": item.quantity}}}}).toArray()
      .done(function(data){
      if(data && data.length){
        callback(null,{
          item : item,
          location : location,
          status : "SUFFICIENT_STOCK"
        });
      }
      else{
        callback({
          item : item,
          location : location,
          status : "INSUFFICIENT_STOCK"
        });
      }
    });
};



var mergePackage = function(items){
  var mergePackages = [];
  for(var i in items){
    if(items[i].uom == "Package"){
      for(var i in items[i].package){
        items[i].package[j].quantity = items[i].package[j].quantity * items[i].quantity;
        mergePackages.push(items[i].package[j]);
      }
    }
    else{
      mergePackages.push(items[i]);
    }
  }
  return mergePackages;
};

var mergeItem = function(items){

  var mergeItems = {};
  for(var i in items){
    if(mergeItems[items[i]._id]){
      mergeItems[items[i]._id].quantity+=items[i].quantity;
    }
    else{
      mergeItems[items[i]._id] = {
        _id: items[i]._id,
        quantity: items[i].quantity
      };

    }
  }
  var arrMergeItems = [];
  for(var i in mergeItems){
    arrMergeItems.push(mergeItems[i]);
  }
  return arrMergeItems;
  };

  var arrangeItems = function(items){
    return mergeItem(mergePackage(items));
  };


  var process_request = function(req,res,next){
    console.log(req.params.object, "object");
  switch(req.params.object){
    case 'sales' :
        switch(req.body.status.status_code){
          case 'SALES_ORDER_CREATED' :
          case 'SALES_ORDER_REVISED' :
            if(req.params.id){
              var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
              getPreviousRecord(req.db,"sales",{_id:id},function(err,order){
                inStockReserve(req.db,order.inventory_location,order.ordered_items,function(err,result){
                  outStockReserve(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                    next();
                  });
                });
              });
            }
            else{
              var items = req.body.ordered_items;
              outStockReserve(req.db,req.body.inventory_location,items,function(err,result){
                next();
              });
            }
          break;
          case 'SALES_INVOICE_REJECTED' :
            var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
            getPreviousRecord(req.db,"sales",{_id:id},function(err,order){
              inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
                next();
              });
            });
          break;
          case 'PROFORMA_INVOICE_CREATED' :
          case 'PROFORMA_INVOICE_REVISED' :
            if(req.params.id){
              var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
              getPreviousRecord(req.db,"sales",{_id:id},function(err,order){
                inStockReserve(req.db,order.inventory_location,order.ordered_items,function(err,result){
                  outStockReserve(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                    next();
                  });
                });
              });
            }
            else{
              var items = req.body.ordered_items;
              outStockReserve(req.db,req.body.inventory_location,items,function(err,result){
                next();
              });
            }
          break;
          case 'DELIVERY_RECEIPT_APPROVED' :
            var items = req.body.ordered_items;
            outStock(req.db,req.body.inventory_location,items,function(err,result){
              next();
            });
          break;
          case 'RETURN_APPROVED' :

          break;
          case 'RETURN_CANCEL' :

          break;
          default: console.log("no status matched");
          next();
          break;
        }
    break;
    case 'consignments' :
      switch (req.body.consignment_transaction_type) {
      case "OUT":
        switch (req.body.status.status_code) {
        case "CONSIGNED_ORDER_CREATED":
        case "CONSIGNED_ORDER_UPDATED":
        case "CONSIGNED_ORDER_REVISED":
          if(req.params.id){
            var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
            getPreviousRecord(req.db,"consignments",{_id:id},function(err,order){
              inStockReserve(req.db,order.inventory_location,order.consigned_items,function(err,result){
                outStockReserve(req.db,req.body.inventory_location,req.body.consigned_items,function(err,result){
                  next();
                });
              });
            });
          }
          else{
            var items = req.body.consigned_items;
            outStockReserve(req.db,req.body.inventory_location,items,function(err,result){
              next();
            });
          }
        break;
        case "CONSIGNED_DELIVERY_RECEIPT_APPROVED":
          var items = req.body.consigned_items;
          outStock(req.db,req.body.inventory_location,items,function(err,result){
            next();
          });
        break;
        default:
          console.log("no status matched");
          next();
        }
        break;
      case "IN":
        switch (req.body.status.status_code) {
        case "CONSIGNED_ORDER_CREATED":
        case "CONSIGNED_ORDER_UPDATED":
        case "CONSIGNED_ORDER_REVISED":
          if(req.params.id){
            var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
            getPreviousRecord(req.db,"consignments",{_id:id},function(err,order){
              outStockReserve(req.db,order.inventory_location,order.consigned_items,function(err,result){
                inStockReserve(req.db,req.body.inventory_location,req.body.consigned_items,function(err,result){
                    next();
                });
              });
            });
          }
          else{
            var items = req.body.consigned_items;
            inStockReserve(req.db,req.body.inventory_location,items,function(err,result){
                next();
            });
          }
        break;
        case "CONSIGNED_DELIVERY_RECEIPT_APPROVED":
          var items = req.body.consigned_items;
          inStock(req.db,req.body.inventory_location,items,function(err,result){
              next();
          });
        break;
        default:
          console.log("no status matched");
          next();
        }
      break;
      default:
        console.log("in or out failed: executing next");
        next();
      } // end in or out
    break;
    default:
      console.log("executing next");
      next();
  }
};

module.exports = {
  process_request : process_request
}
