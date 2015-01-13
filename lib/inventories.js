var async = require("async");
var mongoq = require('mongoq');

var checkStock = function(db,location,items,cb){
    var aItems = arrangeItems(items);
    async.eachSeries(aItems,
      function(item,callback){
        var id = mongoq.mongodb.BSONPure.ObjectID.createFromHexString(item._id);
        checkItemInventory(db,location,item,callback);
      },
      function(err){
        cb(err);
      }
};

var inStock = function(location,items,cb){

};

var outStock = function(db,location,items,cb){
  checkStock(db,location,items,function(err){
    if(err){
      cb(err);
    }
    else{

    }
  });
};

var checkItemInventory = function(db,location,item,callback){
  db.collection("products")
  .find({
    _id : id,
    inventories : {"$elemMatch" : { _id: location, quantity : {"$gte": item.quantity}}}}).toArray()
    .done(function(data){
      if(data && data.length){
        callback({
          item : item,
          location : location,
          status : "INSUFFICIENT_STOCK"
        });
      }
      else{
        callback(null,{
          item : item,
          location : location,
          status : "SUFFICIENT_STOCK"
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
    arrMergeItems.push(mergeItems);
  }
  return arrMergeItems;
};

var arrangeItems = function(items){
  return mergeItem(mergePackage(items));
};

var process_request = function(req,res,next){
  console.log(req.params.object);
  console.log(req.body.status);
  console.log("tanga si ace");

  switch(req.params.object){
    case 'sales' :
        switch(req.body.status.status_code){
          case 'SALES_ORDER_CREATED' :

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

        }
    break;
    case 'product' :

    break;
    case 'consignment' :

    break;
  }
  next();
};

module.exports = {
  process_request : process_request
}
