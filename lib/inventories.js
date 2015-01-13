var async = require("async");
var mongoq = require('mongoq');

var checkStock = function(db,location,items,done){
    var aItems = arrangeItems(items);
    console.log("aItems",aItems);
    async.eachSeries(aItems,
      function(item,callback){
        console.log("item",item);
        console.log(item._id);
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        checkItemInventory(db,location,item,callback);
      },
      function(err){
        done(err,aItems);
      });
};

var getPreviousRecord = function(db,sono,callback){
  db.collection("sales")
  .find({
    sono : sono}).toArray()
      .done(function(data){
      if(data && data.length){
        console.log("getPreviousRecord",data[0]);
        console.log(data[0]);
        callback(null,data[0]);
      }
      else{
        callback(null,null);
      }
    });
};
var outStock = function(db,location,items,cb){
  console.log("location : ", location);
  console.log("items : ", items);
  console.log("cb : ", cb);

  checkStock(db,location,items,function(err,items){
    if(err){
      console.log("======== error ==========");
      cb(err);
    }
    else{
      console.log("outstocking");
      // put the code to deduct to inventory here
    //  var aItems = arrangeItems(items);
      async.eachSeries(items,function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        console.log("id: ", id);
        item.quantity = item.quantity * -1;
        console.log("tangang ace",item.quantity);
        db.collection("products")
        .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":item.quantity}}, {safe: true})
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
  // console.log("instocking");
  // console.log("location : ", location);
  // console.log("items : ", items);
  // console.log("cb : ", cb);
 var aItems = arrangeItems(items);
  async.eachSeries(aItems,function(item,callback){
    var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
    console.log("INSTOCK id: ", id); //ordered_items
    console.log("INSTOCK QUANTITY", item.quantity); //ordered item quantity
    console.log("INSTOCK LOCATION", location);  //

    db.collection("products")
    .update({_id : id, "inventories._id":location}, {"$inc":{"inventories.$.quantity":item.quantity}}, {safe: true})
    .done(function(data){
      console.log("INSTOCK SUCCESS",data);
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
      console.log("==========================================");
      console.log(JSON.stringify(data));
      console.log("==========================================")
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
        console.log("merge items :",items[i]._id," ", mergeItems[items[i]._id].quantity);
    }
    else{
      mergeItems[items[i]._id] = items[i];
      console.log("merge items :",items[i]._id," ", mergeItems[items[i]._id].quantity);
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

  // function isSalesExist(){
  //
  //   db.collection("sales")
  //   .find({
  //     _id : id,
  //     inventories : {"$elemMatch" : { _id: location, quantity : {"$gte": item.quantity}}}})
  //
  //   .find({sono : sono_num})
  //   .done(function(data){
  //     console.log("SUCCESS",data);
  //     callback();
  //   })
  //
  //   return
  // }


  var process_request = function(req,res,next){
    console.log(req.params.object);
    // console.log(req.body.status.status_code);

  switch(req.params.object){
    case 'sales' :
        switch(req.body.status.status_code){
          case 'SALES_ORDER_CREATED' :
            if(req.body.sono){
              getPreviousRecord(req.db,req.body.sono,function(err,order){
                console.log("================== order ========================");
                inStock(req.db,order.inventory_location,order.ordered_items,function(err,result){
                  console.log("in stocked");
                  outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                  //  console.log("err :",err,"result :",result);
                    next();
                  });
                });
              });
            }
            else{
              outStock(req.db,req.body.inventory_location,req.body.ordered_items,function(err,result){
                console.log("err :",err,"result :",result);
                next();
              });
            }

          break;
          case 'SALES_ORDER_REVISED' :

          break;
          case 'PACKING_CREATED' :

          break;
          case 'DELIVERY_RECEIPT_APPROVED' :

          break;
          case 'DELIVERY_RECEIPT_REJECTED' :

          break;
          case 'PROFORMA_INVOICE_APPROVED' :

          break;
          case 'PROFORMA_INVOICE_REVISED' :

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
