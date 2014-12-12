
var delivery = require("../pdf/delivery");
var cdelivery = require("../pdf/cdelivery");
var invoice = require("../pdf/invoice");

module.exports = {

  printDR : delivery.print,
  printSI : invoice.print,
  printCDR : cdelivery.print

};
