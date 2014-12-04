var PDF = require('pdfkit');
var fs = require("fs");
var ticket = require('./ticket.json');

var pdf = {

		pageSetting : function(options){

			// var doc = new PDFDocument({
			// 	size: options.size || 'letter',
			// 	layout: options.layout || 'portrait',
			// 	margin : options.margin || {
			// 		top:10,
			// 		bottom:10,
			// 		left:10,
			// 		right:0
			// 	},
					var	doc = new PDF({
			  // size: [700,600],
			  layout: 'portrait',
			  margins: {
			    top: 0,
			    bottom: 0,
			    left: 10,
			    right: 10
				},
				info: options.info || {
					Title:'TI-0000001',
					Subject:'TI-00000001',
					Author:'Ace'
				}
			});
			return doc;
		},

		pageHeader : function(doc,ticket){
			/***      Start Header     ***/
			doc.image('../public/assets/img/beautylane-logo.png', 15, 15, {width: 130});
			doc.y = 20;
		doc.font('Courier');
			doc.fontSize(7);
			doc.text("BEAUTY LANE PHILIPPINES, INC.",{align:'center'});
			doc.moveDown(0.2);
			doc.text("10/F Alabang Business Tower, Acacia Ave.",{align:'center'});
			doc.moveDown(0.2);
			doc.text("Madrigal Business Park, Alabang Muntinlupa City 1780 Philippines",{align:'center'});
			doc.moveDown(0.2);
			doc.text("02-771-0771 02-772-0772,  0917-707-0707",{align:'center'});
			doc.moveDown(0.2);

			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text("TRIPTICKET FORM",380,20,{align:'right'});
			doc.text("TI012014",380,35,{align:'right'});
			doc.moveDown(0);
			doc.fontSize(10);
			doc.text("12-12-14",420,50,{align:'right'});
			doc.text("Page "+1+" of "+2,420,65,{align:'right'});
			doc.moveDown(0);

			var y = 120;
			doc.font('Courier-Bold');
			doc.text("ARRIVAL",25, y);
			doc.text("DEPARTURE",75, y);
			doc.text("DR NUMBER",135, y);
			doc.text("CUSTOMER NAME",210, y);
			doc.text("ADDRESS",340, y);
			doc.text("RECEIVED BY",430,y);
			doc.text("SIGNATURE", 520,y);

			doc.moveDown(2);
			return doc;
		},
		pageFooter : function(doc,ticket){
			doc.font('Courier');
			doc.text("RELEASING:", 25,700);
			doc.text("________________", 100,700);
			doc.text("DATE/TIME", 120,710);
			doc.text("________________",250,700);
			doc.text("RELEASED BY", 260,710);
			doc.text("________________", 410,700);
			doc.text("RELEASED TO", 430,710);

			doc.text("RETURN:", 25,730);
			doc.text("________________", 100,730);
			doc.text("TIME", 140,740);
			doc.text("________________", 250,730);
			doc.text("RECEIVED BY", 260,740);
		  doc.text("___________________________", 390,730);
		  doc.text("ENTERED INTO SYSTEM BY/DATE", 390,740);
			return doc
		}
};

module.exports.print = function(ticket,result){

	var doc = pdf.pageSetting({
		info:{
		Title:ticket.sino,
		Subject:ticket.sino,
		Author:ticket.delivery_created_by
	}});
	var filename = 'ticket'+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,ticket);
	doc = pdf.pageFooter(doc,ticket);
	doc.y = 140;
	doc.fontSize(9);
	for(var i in ticket){
		var y= doc.y;
		doc.font('Courier');
		doc.text(ticket[i].arrival,25,y,{width:70});
		doc.text(ticket[i].departure,75,y,{width:80});
		doc.text(ticket[i].drno,130,y,{width:70});
		doc.text(ticket[i].customer_name,210,y,{width:100});
		doc.text(ticket[i].address,300,y,{width:150});


		doc.moveDown(0.8)
		if(doc.y >= 640){
			doc.addPage();
			doc = pdf.pageHeader(doc,ticket);
			doc = pdf.pageFooter(doc,ticket);
			doc.y =140;
		}
	}
	doc.end();

};

module.exports.print(ticket,function(err,result){
	console.log(err);
	console.log(result);
});
