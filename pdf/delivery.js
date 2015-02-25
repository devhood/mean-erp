var PDF = require('pdfkit');
var fs = require("fs");
var path = require("path")
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

		// var n = d.toDateString();
		// T16:00:00.000Z

		pageHeader : function(doc,drinfo){
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(drinfo.drno,465,88,{align:'left'});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);

			var date = drinfo.delivery_date.replace("T16:00:00.000Z","");
			doc.text(date,480,108,{align:'left'});
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(drinfo.customer.company_name,40,123,{width:260,indent:40});
			doc.text(drinfo.customer.company_name,340,123,{width:260,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(drinfo.customer.billing_address.landmark+","+drinfo.customer.billing_address.barangay+","+drinfo.customer.billing_address.city+","+drinfo.customer.billing_address.province+","+drinfo.customer.billing_address.country+","+drinfo.customer.billing_address.zipcode,10,doc.y,{width:250,align:'justify'});
			doc.text(drinfo.customer.shipping_address.landmark+","+drinfo.customer.shipping_address.barangay+","+drinfo.customer.shipping_address.city+","+drinfo.customer.shipping_address.province+","+drinfo.customer.shipping_address.country+","+drinfo.customer.shipping_address.zipcode,300,y,{width:250,align:'justify'});
			doc.moveDown(0);
			if (drinfo.sono) {
			doc.text(drinfo.sono,35,180);
			};
			if (drinfo.pono) {
			doc.text(drinfo.pono,205,180);
			};
			if (drinfo.refno) {
			doc.text(drinfo.refno,360,180);
			};
			doc.text(drinfo.ordered_by,520,180);
			doc.moveDown(0);
			y = doc.y;
			doc.text(drinfo.customer.payment_term,35);

			// date = drinfo.delivery_date.replace("T16:00:00.000Z","");
			doc.text(date,220,y);
			doc.text(drinfo.delivery_method,360,y);
			doc.text(drinfo.customer.sales_executive,500,y);
			doc.text(drinfo.special_instruction,35,y+10);
			doc.moveDown(1);
			return doc;
		},
		pageFooter : function(doc,drinfo){
			doc.text(drinfo.ordered_items.length,130,610);
			doc.text(drinfo.total_quantity,560,610,{width:35,align:'center'});
			if (drinfo.prepared_by) doc.text(drinfo.prepared_by,25,730);
			if (drinfo.dr_approved_by) doc.text(drinfo.dr_approved_by,180,730);
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
	var filename = __dirname.replace(path.sep+"pdf",path.sep+"public"+path.sep+"print")+path.sep+drinfo.drno+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,drinfo);
	doc = pdf.pageFooter(doc,drinfo);
	doc.y = 255;
	for(var i in drinfo.ordered_items){
		var y= doc.y;
		doc.font('Courier');
		doc.fontSize(8);
		doc.text(drinfo.ordered_items[i].bl_code,15,y,{width:80});
		doc.text(drinfo.ordered_items[i].name,95,y,{width:130,align:'left'});
		doc.text(drinfo.ordered_items[i].brand,240,y,{width:100});
		// doc.text(drinfo.ordered_items[i].description,310,y,{width:190});
		doc.text(drinfo.ordered_items[i].uom,510,y,{width:50});
		doc.text(drinfo.ordered_items[i].quantity,560,y,{width:35,align:'center'});
		doc.moveDown(1);
		if(doc.y >= 580){
			doc.addPage();
			doc = pdf.pageHeader(doc,drinfo);
			doc = pdf.pageFooter(doc,drinfo);
			doc.y = 255;
		}
	}
	doc.end();
	result(null,"/print/"+drinfo.drno+'.pdf');
};
