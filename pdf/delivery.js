var PDF = require('pdfkit');
var drinfo = require('./drinfo.json');
var fs = require("fs");
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
					Title:'DR-0000001',
					Subject:'DR-00000001',
					Author:'Chito Cascante'
				}
			});
			return doc;
		},

		pageHeader : function(doc,drinfo){
			/***      Start Header     ***/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(drinfo.drno,380,105,{align:'right'});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(drinfo.delivery_created_at,420,120,{align:'right'});
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),40,135,{width:240,indent:40});
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),320,135,{width:240,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(drinfo.b_address,40,doc.y,{width:240,align:'justify'});
			doc.text(drinfo.s_address,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(drinfo.sono,65,212);
			doc.text(drinfo.pono,205,212);
			doc.text(drinfo.refno,360,212);
			doc.moveDown(0);
			y = doc.y;
			doc.text(drinfo.term,65);
			doc.text(drinfo.ddate,220,y);
			doc.text(drinfo.shipping,360,y);
			doc.text(drinfo.se,500,y);
			/***      Stop Header     ***/

			doc.font('Courier-Bold');
			doc.text("CODE",25,283);
			doc.text("PRODUCT",105,283);
			doc.text("BRAND",235,283);
			doc.text("DESCRIPTION",335,283);
			doc.text("UOM",495,283);
			doc.text("QTY",525,283);

			doc.moveDown(2);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			/***      Start Footer     ***/
			doc.text(drinfo.dr_item.length,130,680);
			doc.text(drinfo.dr_item.length,330,680);
			doc.text(drinfo.ttl_sales,500,680);
			doc.text(drinfo.ttl_discount,500,680);
			doc.text(drinfo.ttl_vat,500,700);
			doc.text(drinfo.ttl_net,500,710);
			doc.text(drinfo.order_created_by,50,760);
			doc.text(drinfo.delivery_created_by,200,760);
			 return doc
		}
};

module.exports.print = function(drinfo,result){

	var doc = pdf.pageSetting({
		info:{
		Title:drinfo.drno,
		Subject:drinfo.drno,
		Author:drinfo.delivery_created_by
	}});
	var filename = __dirname+"/"+drinfo.drno+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,drinfo);
	doc = pdf.pageFooter(doc,drinfo);
	doc.y = 315;
	for(var i in drinfo.dr_item){
		var y= doc.y;
		doc.font('Courier');
		doc.text(drinfo.dr_item[i].code,20,y,{width:70});
		doc.text(drinfo.dr_item[i].name,90,y,{width:80});
		doc.text(drinfo.dr_item[i].brand,245,y,{width:65});
		doc.text(drinfo.dr_item[i].description,310,y,{width:165});
		doc.text(drinfo.dr_item[i].uom,500,y,{width:50});
		doc.text(drinfo.dr_item[i].quantity,545,y,{width:35});


		doc.moveDown(0.8);
		if(doc.y >= 640){
			doc.addPage();
			doc = pdf.pageHeader(doc,drinfo);
			doc = pdf.pageFooter(doc,drinfo);
			doc.y = 275;
		}
	}
	doc.end();

};

module.exports.print(drinfo,function(err,result){
	console.log(err);
	console.log(result);
});
