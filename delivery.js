var PDFDocument = require('pdfkit');
var drinfo = require('./drinfo.json');
var fs = require("fs");
var pdf = {

		pageSetting : function(options){

			var doc = new PDFDocument({
				size: options.size || 'letter',
				layout: options.layout || 'portrait',
				margin : options.margin || {
					top:10,
					left:10,
					bottom:10,
					width:10
				},
				info: options.info || {
					Title:'DR-00000000001',
					Subject:'DR-00000000001',
					Author:'Chito Cascante'
				}
			});
			return doc;

		},
		pageHeader : function(doc,drinfo){
			/***      Start Header     ***/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(drinfo.drno,400,72,{align:'right'});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(drinfo.delivery_created_at,420);
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),40,105,{width:240,indent:40});
			doc.text(drinfo.customer + (drinfo.branch? " - " + drinfo.branch : ""),310,105,{width:240,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(drinfo.b_address,40,doc.y,{width:240,align:'justify'});
			doc.text(drinfo.s_address,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(drinfo.sono,65,175);
			doc.moveDown(0);
			y = doc.y;
			doc.text(drinfo.term,65);
			doc.text(drinfo.ddate,210,y);
			doc.text(drinfo.shipping,360,y);
			doc.text(drinfo.se,500,y);
			/***      Stop Header     ***/

			doc.font('Courier-Bold');
			doc.text("CODE",30,243);
			doc.text("PRODUCT",100,243);
			doc.text("BRAND",185,243);
			doc.text("DESCRIPTION",325,243);
			doc.text("UOM",485,243);
			doc.text("QTY",515,243);

			doc.moveDown(2);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			/***      Start Footer     ***/
			doc.text(drinfo.dr_item.length,130,667);
			doc.text(drinfo.dr_item.length,330,667);
			doc.text(drinfo.ttl_sales,500,688);
			doc.text(drinfo.ttl_discount,500);
			doc.text(drinfo.ttl_vat,500);
			doc.text(drinfo.ttl_net,500);
			doc.text(drinfo.order_created_by,50,750);
			doc.text(drinfo.delivery_created_by,200,750);
			return doc;
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
	doc.y = 275;
	for(var i in drinfo.dr_item){
		var y= doc.y;
		doc.font('Courier');
		doc.text(drinfo.dr_item[i].code,30,y,{width:70});
		doc.text(drinfo.dr_item[i].name,100,y,{width:80});
		doc.text(drinfo.dr_item[i].brand,185,y,{width:55});
		doc.text(drinfo.dr_item[i].description,325,y,{width:115});
		doc.text(drinfo.dr_item[i].quantity,395,y,{width:35});
		doc.text(drinfo.dr_item[i].uom,415,y,{width:50});

		doc.moveDown(0.5);
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
