
var delivery = require("../pdf/delivery");
var cdelivery = require("../pdf/cdelivery");
var invoice = require("../pdf/invoice");
var invoice = require("../pdf/proforma");

module.exports = {

  printDR : delivery.print,
  printSI : invoice.print,
  printPF : proforma.print,
  printCDR : cdelivery.print

};
