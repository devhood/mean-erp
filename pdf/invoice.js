var PDF = require('pdfkit');
var siinfo = require('./siinfo.json');
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
					Title:'SI-0000001',
					Subject:'SI-00000001',
					Author:'Chito Cascante'
				}
			});
			return doc;
		},

		pageHeader : function(doc,siinfo){
			/***      Start Header     ***/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(siinfo.sino,380,105,{align:'right'});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(siinfo.delivery_created_at,420,120,{align:'right'});
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(siinfo.customer + (siinfo.branch? " - " + siinfo.branch : ""),40,135,{width:240,indent:40});
			doc.text(siinfo.customer + (siinfo.branch? " - " + siinfo.branch : ""),320,135,{width:240,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(siinfo.b_address,40,doc.y,{width:240,align:'justify'});
			doc.text(siinfo.s_address,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(siinfo.sono,65,212);
			doc.text(siinfo.pono,205,212);
			doc.text(siinfo.refno,360,212);
			doc.moveDown(0);
			y = doc.y;
			doc.text(siinfo.term,65);
			doc.text(siinfo.ddate,220,y);
			doc.text(siinfo.shipping,360,y);
			doc.text(siinfo.se,500,y);
			doc.moveDown(0);
			y = doc.y;
			doc.text(siinfo.delivery_notes,65);
			/***      Stop Header     ***/

			// doc.font('Courier-Bold');
			// doc.text("CODE",25,283);
			// doc.text("PRODUCT",105,283);
			// doc.text("BRAND",235,283);
			// doc.text("DESCRIPTION",335,283);
			// doc.text("UOM",495,283);
			// doc.text("QTY",525,283);

			doc.moveDown(2);
			return doc;
		},
		pageFooter : function(doc,siinfo){
			/***      Start Footer     ***/
			doc.text(siinfo.dr_item.length,130,700);
			doc.text(siinfo.dr_item.length,330,700);

			doc.text(siinfo.ttl_sales,500,680);
			doc.text(siinfo.ttl_discount,500,690);
			doc.text(siinfo.ttl_vat,500,700);
			doc.text(siinfo.ttl_net,500,710);

			doc.text('VATableSales',110,650);
			doc.text('VAT-ExemptSales',110,660);
			doc.text('Zero-RatedSales',110,670);
			doc.text('Vat Amount',110,680);

			doc.text(siinfo.order_created_by,50,760);
			doc.text(siinfo.order_approved_by,200,760);

			 return doc
		}
};

module.exports.print = function(siinfo,result){

	var doc = pdf.pageSetting({
		info:{
		Title:siinfo.sino,
		Subject:siinfo.sino,
		Author:siinfo.delivery_created_by
	}});
	var filename = __dirname+"/"+siinfo.sino+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,siinfo);
	doc = pdf.pageFooter(doc,siinfo);
	doc.y = 315;
	for(var i in siinfo.dr_item){
		var y= doc.y;
		doc.font('Courier');
		doc.text(siinfo.dr_item[i].code,20,y,{width:70});
		doc.text(siinfo.dr_item[i].name,90,y,{width:80});
		doc.text(siinfo.dr_item[i].brand,245,y,{width:65});
		doc.text(siinfo.dr_item[i].description,310,y,{width:165});
		doc.text(siinfo.dr_item[i].uom,500,y,{width:50});
		doc.text(siinfo.dr_item[i].quantity,545,y,{width:35});


		doc.moveDown(0.8);
		if(doc.y >= 640){
			doc.addPage();
			doc = pdf.pageHeader(doc,siinfo);
			doc = pdf.pageFooter(doc,siinfo);
			doc.y =315;
		}
	}
	doc.end();

};

module.exports.print(siinfo,function(err,result){
	console.log(err);
	console.log(result);
});
