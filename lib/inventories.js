var async = require("async");
var mongoq = require('mongoq');

var checkStock = function(){

};

var inStock = function(){

};

var outStock = function(){

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
