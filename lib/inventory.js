var async = require("async");

module.exports = {
  transact : function(req,res,next){
    if(req.body.triggerInventory){
      if(req.body.ordered_items){
        var stock_pile = {};
        var stock_pile_arr =[];
        var items = req.body.ordered_items;
        /** Stock filing **/
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
                  item : pitems[j]._id
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
        /** Place stock file in array **/
        for(var i in stock_pile){
          stock_pile_arr.push(stock_pile[i]);;
        }
        /** Stock Checking **/
        var stock_availability = [];
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
              }
              stock_availability.push(item);
              callback();
            });

          },function(err){
            console.log("stock_availability",stock_availability);
            next();
          })
        }
        else{
          next();
        }
      }
      else{
        next();
      }
    }
  };
