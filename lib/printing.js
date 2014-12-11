
var delivery = require("../pdf/delivery");
var invoice = require("../pdf/invoice");

modules.exports = {

  printDR : function(sales,cb){
    delivery.print(sales,cb);
  },
  printSI : function(sales,cb){
    invoice.print(sales,cb);
  }

};
