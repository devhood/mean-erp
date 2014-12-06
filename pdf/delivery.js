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
			  size: options.size || 'letter',
			  layout: 'portrait',
			  margins: {
			    top: 0,
			    bottom: 0,
			    left: 0,
			    right: 0
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
			doc.text(drinfo.drno,465,88,{align:'left'});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(drinfo.delivery_created_at,480,108,{align:'left'});
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),40,123,{width:260,indent:40});
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),340,123,{width:260,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(drinfo.b_address,10,doc.y,{width:240,align:'justify'});
			doc.text(drinfo.s_address,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(drinfo.sono,35,180);
			doc.text(drinfo.pono,205,180);
			doc.text(drinfo.refno,360,180);
			doc.text(drinfo.ordered_by,520,180);
			doc.moveDown(0);
			y = doc.y;
			doc.text(drinfo.term,35);
			doc.text(drinfo.ddate,220,y);
			doc.text(drinfo.shipping,360,y);
			doc.text(drinfo.se,500,y);
			doc.text(drinfo.oreder_notes,35,y+10);
			/***      Stop Header     ***/

//			doc.font('Courier-Bold');
//			doc.text("CODE",25,230);
//			doc.text("PRODUCT",105,230);
//			doc.text("BRAND",225,230);
//			doc.text("DESCRIPTION",335,230);
//			doc.text("UOM",495,230);
//			doc.text("QTY",560,230);

			doc.moveDown(1);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			/***      Start Footer     ***/
			doc.text(drinfo.dr_item.length,130,610);
			doc.text(drinfo.dr_item.length,560,610,{width:35,align:'center'});
//			doc.text(drinfo.ttl_sales,500,680);
//			doc.text(drinfo.ttl_discount,500,680);
//			doc.text(drinfo.ttl_vat,500,700);
//			doc.text(drinfo.ttl_net,500,710);
			doc.text(drinfo.order_created_by,25,730);
			doc.text(drinfo.delivery_created_by,180,730);
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
	doc.y = 255;
	for(var i in drinfo.dr_item){
		var y= doc.y;
		doc.font('Courier');
		doc.fontSize(8);
		doc.text(drinfo.dr_item[i].code,-1,y,{width:80});
		doc.text(drinfo.dr_item[i].name,90,y,{width:100});
		doc.text(drinfo.dr_item[i].brand,205,y,{width:100});
		doc.text(drinfo.dr_item[i].description,310,y,{width:190});
		doc.text(drinfo.dr_item[i].uom,510,y,{width:50});
		doc.text(drinfo.dr_item[i].quantity,560,y,{width:35,align:'center'});
		doc.moveDown(0.5);
		if(doc.y >= 580){
			doc.addPage();
			doc = pdf.pageHeader(doc,drinfo);
			doc = pdf.pageFooter(doc,drinfo);
			doc.y = 255;
		}
	}
	doc.end();

};

module.exports.print(drinfo,function(err,result){
	console.log(err);
	console.log(result);
});
