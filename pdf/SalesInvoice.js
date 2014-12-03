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
					Title:'SI-0000001',
					Subject:'SI-00000001',
					Author:'Chito Cascante'
				}
			});
			return doc;
		},

		pageHeader : function(doc,drinfo){
			/***      Start Header     ***/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(drinfo.sino,500,55);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(drinfo.delivery_created_at,510,70);
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),40,90,{width:260,indent:40});
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),340,90,{width:260,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(drinfo.b_address,10,doc.y,{width:240,align:'justify'});
			doc.text(drinfo.s_address,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(drinfo.sono,35,145);
			doc.text(drinfo.pono,205,145);
			doc.text(drinfo.refno,360,145);
			doc.text(drinfo.ordered_by,520,145);
			doc.moveDown(0);
			y = doc.y;
			doc.text(drinfo.term,35);
			doc.text(drinfo.ddate,220,y);
			doc.text(drinfo.shipping,360,y);
			doc.text(drinfo.se,500,y);
			doc.text(drinfo.oreder_notes,35,y+10);
			
			/***      Stop Header     ***/

			doc.font('Courier-Bold');
			doc.text("CODE",10,200);
			doc.text("PRODUCT",85,200);
			doc.text("DESCRIPTION",205,200);
			doc.text("QTY",345,200);
			doc.text("UOM",395,200);
			doc.text("U/P",450,200);
			doc.text("DISCOUNT",480,200);
			doc.text("AMOUNT",540,200);
			doc.moveDown(1);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			/***      Start Footer     ***/
			doc.text(drinfo.ttl_vat,130,646);/*VATable Sales*/
			doc.text(drinfo.ttl_discount,130,658);/*Vat Exempt Sales*/
			doc.text(drinfo.ttl_sales,130,670); /*Zero Rated Sales*/
			doc.text(drinfo.dr_item.length,130,682);/*VAT AMOUNT*/
			doc.text(drinfo.ttl_net,560,646);/*Total Sales Vat inclusive*/
			doc.text(drinfo.ttl_net,560,658);/*Less Vat*/
			doc.text(drinfo.ttl_net,560,670);/*Amount Net of VAT*/
			doc.text(drinfo.dr_item.length,560,682,{width:35,align:'center'});/*Less CS/PWD Discount*/
			doc.text(drinfo.dr_item.length,560,694,{width:35,align:'center'});/*Amount Due*/
			doc.text(drinfo.dr_item.length,560,706,{width:35,align:'center'});/*Add Vat*/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(drinfo.dr_item.length,560,718,{width:35,align:'center'});/*Total Amount Due*/
			doc.fontSize(10);
			doc.font('Courier');
			doc.text(drinfo.order_created_by,25,755);
			doc.text(drinfo.delivery_created_by,180,755);
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
	var filename = __dirname+"/"+drinfo.sino+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,drinfo);
	doc = pdf.pageFooter(doc,drinfo);
	doc.y = 225;
	for(var i in drinfo.dr_item){
		var y= doc.y;
		doc.font('Courier');
	        doc.fontSize(10);
		doc.text(drinfo.dr_item[i].code,-1,y,{width:65});
		doc.text(drinfo.dr_item[i].name,70,y,{width:80});
		doc.text(drinfo.dr_item[i].description,175,y,{width:100});
		doc.text(drinfo.dr_item[i].quantity,340,y,{width:35,align:'center'});
		doc.text(drinfo.dr_item[i].uom,390,y,{width:50});
		doc.text(drinfo.dr_item[i].pprice,440,y,{width:35,align:'center'});
		doc.text(drinfo.dr_item[i].rdiscount,480,y,{width:35,align:'center'});
		doc.text(drinfo.dr_item[i].rvat,530,y,{width:80,align:'center'});
		doc.moveDown(1);
		if(doc.y >= 620){
			doc.addPage();
			doc = pdf.pageHeader(doc,drinfo);
			doc = pdf.pageFooter(doc,drinfo);
			doc.y = 225;
		}
	}
	doc.end();

};

module.exports.print(drinfo,function(err,result){
	console.log(err);
	console.log(result);
});
