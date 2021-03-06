var async = require("async");
var mongoq = require('mongoq');

var getPreviousRecord = function(db,collection,filter,callback){

  db.collection(collection)
  .find(filter).toArray()
      .done(function(data){

      if(data && data.length){
        console.log("with previous data");
        callback(null,data[0]);
      }
      else{
        console.log("no previous data");
        callback(null,null);
      }
    });
};
var logInventoryTransaction = function(db,location,reference,item,callback){
  var fDate = new Date();
  fDate =(fDate.getMonth() + 1) + "/" + fDate.getDate() + "/" + fDate.getFullYear()+" "+  fDate.getHours()+":"+fDate.getMinutes()+":"+fDate.getSeconds();

  var content = {
    location : location,
    reference : reference,
    item : item,
     date : fDate
  }
  db.collection("inv_trans_history")
    .insert(content, {safe: true})
    .done(function(data){
      callback(null,data)
    })
    .fail( function( err ) {
      callback(err);
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
        console.log("there is no item left");
        console.log("aItems", aItems, err);
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
        console.log("there is no item left");
        console.log("aItems", aItems, err);
        done(err,aItems);
      });
};


var outStock = function(db,location,reference,items,cb){
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
          logInventoryTransaction(db,location,reference,item,callback);
          //callback();
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

var inStock = function(db,location,reference,items,cb){
 var aItems = arrangeItems(items);
  async.eachSeries(aItems,function(item,callback){
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
    var quantity = item.quantity;
    db.collection("products")
    .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":quantity}}, {safe: true})
    .done(function(data){
      logInventoryTransaction(db,location,reference,item,callback);
      // callback();
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
    if(items[i].uom == "Package" || items[i].uom == "Promo"){
      for(var j in items[i].packages){
        items[i].packages[j].quantity = items[i].packages[j].quantity * items[i].quantity;
        mergePackages.push(items[i].packages[j]);
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
        quantity: items[i].quantity,
        bl_code : items[i].bl_code,
        brand : items[i].brand,
        name : items[i].name,
        uom : items[i].uom,
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
  switch(req.params.object){
    case 'sales' :
      var reference = {object:req.params.object};
        switch(req.body.status.status_code){
          case 'SALES_ORDER_OVERRIDE' :
          case 'SALES_ORDER_CREATED' :
          case 'SALES_ORDER_REVISED' :
            reference.key ="sono";
            reference.value = req.body.sono;
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
            reference.type = "IN";
            var items = req.body.ordered_items;
            reference.value = req.body.sono;
            reference.key = "sono";
              inStock(req.db,req.body.inventory_location,reference,items,function(err,result){
                next();
              });
          break;
          case 'PROFORMA_INVOICE_CREATED' :
          case 'PROFORMA_INVOICE_REVISED' :
            reference.key ="pfno";
            reference.value = req.body.pfno;
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
            reference.type = "OUT";
            if (req.body.sono)     { reference.value = req.body.sono; reference.key="sono"; }
            else if (req.body.pfno){ reference.value = req.body.pfno; reference.key="pfno"; }
            var items = req.body.ordered_items;
            outStock(req.db,req.body.inventory_location,reference,items,function(err,result){
              next();
            });
          break;
          case 'RETURN_CREATED' :
          case 'RETURN_REVISED' :
            var items = req.body.returned_items;
            if(req.body.rmrno){
              var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
              getPreviousRecord(req.db,"sales",{_id:id},function(err,order){
                outStockReserve(req.db,order.inventory_location,order.returned_items,function(err,result){
                  inStockReserve(req.db,req.body.inventory_location,items,function(err,result){
                    next();
                  });
                });
              });
            }
            else{
              var items = req.body.returned_items;
              inStockReserve(req.db,req.body.inventory_location,items,function(err,result){
                next();
              });
            }
          break;
          case 'RETURN_APPROVED' :
            reference.type = "IN";
            if (req.body.sono)     { reference.value = req.body.sono; reference.key="sono"; }
            else if (req.body.pfno){ reference.value = req.body.pfno; reference.key="pfno"; }
            var items = req.body.returned_items;
            reference.key ="rmrno";
            reference.value = req.body.rmrno;
            inStock(req.db,req.body.inventory_location,reference,items,function(err,result){
              next();
            });
          break;
          case 'MEMO_REJECTED' :
            var items = req.body.returned_items;
            reference.value = req.body.rmrno;
            reference.key = "rmrno";
            reference.type = "OUT";
              outStock(req.db,req.body.inventory_location,reference,items,function(err,result){
                next();
              });
          break;
          default: console.log("no status matched");
            next();
        }
    break;
    case 'consignments' :
      var reference = {object:req.params.object};
          reference.value = req.body.cono;
          reference.key = "cono";
      switch (req.body.consignment_transaction_type) {
      case "OUT":
        reference.type = "OUT";
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
          reference.type = "OUT";
          outStock(req.db,req.body.inventory_location,reference,items,function(err,result){
            next();
          });
        break;
        default:
          console.log("no status matched");
          next();
        }
        break;
      case "IN":
        reference.type = "IN";
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
          inStock(req.db,req.body.inventory_location,reference,items,function(err,result){
              next();
          });
        break;
        default:
          console.log("no status matched consignments");
          next();
        }
      break;
      default:
        next();
      } // end in or out
    break;
    case 'adjustments' :
      var reference = {object:req.params.object};
        reference.key = "adjno";
        reference.value = req.body.adjno;
      switch (req.body.status.status_code) {
        case "ADJUSTMENT_APPROVED":
          switch (req.body.adjustment_transaction_type) {
          case "OUT":
            reference.type = "OUT";
            var items = req.body.adjusted_items;
            outStockReserve(req.db,req.body.inventory_location,items,function(err,result){
              outStock(req.db,req.body.inventory_location,reference,items,function(err,result){
                next();
              });
            });
            break;
          case "IN":
            reference.type = "IN";
            var items = req.body.adjusted_items;
            inStockReserve(req.db,req.body.inventory_location,items,function(err,result){
              inStock(req.db,req.body.inventory_location,reference,items,function(err,result){
                  next();
              });
            });
            break;
            default:
              next();
          }
        break;
        default:
          console.log("no status matched adjustment");
          next();
      }
    break;
    case 'shipments' :
      var reference = {object:req.params.object};
          reference.type = "IN";
          reference.key = "shipno";
          reference.value =req.body.shipno;
      switch (req.body.status.status_code) {
        case "SHIPMENT_CREATED":
        case "SHIPMENT_UPDATED":
          if(req.params.id){
            var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(req.params.id);
            getPreviousRecord(req.db,"shipments",{_id:id},function(err,order){
              outStockReserve(req.db,order.inventory_location,order.shipment_items,function(err,result){
                inStockReserve(req.db,req.body.inventory_location,req.body.shipment_items,function(err,result){
                    next();
                });
              });
            });
          }
          else{
            var items = req.body.shipment_items;
            inStockReserve(req.db,req.body.inventory_location,items,function(err,result){
              next();
            });
          }
        break;
        case "SHIPMENT_APPROVED":
          var items = req.body.shipment_items;
            inStock(req.db,req.body.inventory_location,reference,items,function(err,result){
                next();
          });
        break;
        default:
          console.log("no status matched");
          next();
      }
    break;
    default:
      console.log("no module matched: executing next");
      next();
  }
};

module.exports = {
  process_request : process_request
}
