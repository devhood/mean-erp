var PDF = require('pdfkit');
var drinfo = require('./drinfo.json');
var fs = require("fs");
var pdf = {

		pageSetting : function(options){

				var	doc = new PDF({
			  size: options.size || 'letter',
			  layout: 'portrait',
			  margins: {
			    top: 0,
			    bottom: 0,
			    left: 0,
			    right: 0
				},
				info: options.info
			});
			return doc;
		},

		pageHeader : function(doc,drinfo){
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
			doc.text(drinfo.customer.company_name),40,123,{width:260,indent:40});
			doc.text(drinfo.customer.company_name),340,123,{width:260,indent:40});
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
			doc.moveDown(1);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			doc.text(drinfo.ordered_items.length,130,610);
			doc.text(drinfo.ordered_items.length,560,610,{width:35,align:'center'});
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
	for(var i in drinfo.ordered_items){
		var y= doc.y;
		doc.font('Courier');
		doc.fontSize(8);
		doc.text(drinfo.ordered_items[i].code,-1,y,{width:80});
		doc.text(drinfo.ordered_items[i].name,90,y,{width:100});
		doc.text(drinfo.ordered_items[i].brand,205,y,{width:100});
		doc.text(drinfo.ordered_items[i].description,310,y,{width:190});
		doc.text(drinfo.ordered_items[i].uom,510,y,{width:50});
		doc.text(drinfo.ordered_items[i].quantity,560,y,{width:35,align:'center'});
		doc.moveuDown(0.5);
		if(doc.y >= 580){
			doc.addPage();
			doc = pdf.pageHeader(doc,drinfo);
			doc = pdf.pageFooter(doc,drinfo);
			doc.y = 255;
		}
	}
	doc.end();
	result(null,filename);
};
