var async = require("async");
var mongoq = require('mongoq');

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

var getPreviousRecord = function(db,filter,callback){

  db.collection("sales")
  .find(filter).toArray()
      .done(function(data){
      if(data && data.length){
        callback(null,data[0]);
      }
      else{
        callback(null,null);
      }
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
        item.quantity = item.quantity * -1;
        db.collection("products")
        .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":item.quantity}}, {safe: true})
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
          cb(items);
        }
      });
    }
  });
};
var inStock = function(db,location,items,cb){
 var aItems = arrangeItems(items);
  async.eachSeries(aItems,function(item,callback){
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
    console.log(id,item.quantity);
    db.collection("products")
    .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":item.quantity}}, {safe: true})
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
      cb(items);
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

var subtractItemInventory = function(db,location,item,callback){

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
      mergeItems[items[i]._id] = items[i];
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
        switch(req.body.status.status_code){
          case 'SALES_ORDER_CREATED' :
            if(req.body.sono){
              getPreviousRecord(req.db,{sono:req.body.sono},function(err,order){
                inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
                  outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                    next();
                  });
                });
              });
            }
            else{
              outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                next();
              });
            }

          break;
          case 'SALES_ORDER_REVISED' :
            getPreviousRecord(req.db,{sono:req.body.sono},function(err,order){
              inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
                outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                  next();
                });
              });
            });
          break;
          case 'PACKING_CREATED' :
            next();
          break;
          case 'DELIVERY_RECEIPT_APPROVED' :
            next();
          break;
          case 'DELIVERY_RECEIPT_REJECTED' :
            next();
          break;
          case 'PROFORMA_INVOICE_CREATED' :
            if(req.body.pfno){
              async.auto({
                "gpr" : function(cb){

                  getPreviousRecord(req.db,{pfno:req.body.pfno},function(err,result){
                    return cb(err,result);
                  });
                },
                "is" : ['gpr',function(cb,result){
                  var order = result.gpr;

                  inStock(req.db,order.inventory_location,order.ordered_items,cb);
                }],
                "os" : ['is',function(cb,result){
                  cb();
                  //outStock(req.db,req.body.inventory_location,req.body.ordered_items,cb);
                }]

              },function(err,result){
                next();
              });
              // getPreviousRecord(req.db,{pfno:req.body.pfno},function(err,order){
              //   inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
              //       console.log("chito");
              //     outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
              //       next();
              //     });
              //   });
              // });
            }
            else{
              outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                console.log("err :",err,"result :",result);
                next();
              });
            }
          break;
          case 'PROFORMA_INVOICE_APPROVED' :
            next();
          break;
          case 'PROFORMA_INVOICE_REVISED' :
            getPreviousRecord(req.db,req.body.sono,function(err,order){
              inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
                outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                  next();
                });
              });
            });
          break;
          case 'PROFORMA_INVOICE_REJECTED' :

          break;
          case 'RETURN_APPROVED' :

          break;
          case 'RETURN_CANCEL' :

          break;
          case '' :

          break;
          case '' :

          break;
          default: console.log("no status matched");

        }
    break;
    case 'product' :
      next();
    break;
    case 'consignment' :

    break;
  }
  next();
};

module.exports = {
  process_request : process_request
}
