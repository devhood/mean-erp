
var delivery = require("../pdf/delivery");
var cdelivery = require("../pdf/cdelivery");
var invoice = require("../pdf/invoice");
var proforma = require("../pdf/proforma");

module.exports = {

  printDR : delivery.print,
  printSI : invoice.print,
  printPF : proforma.print,
  printCDR : cdelivery.print

};
