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

		pageHeader : function(doc,pfinfo){
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(pfinfo.sino,500,55);
			doc.font('Courier');
			doc.fontSize(10);
			doc.text(pfinfo.delivery_created_at,510,70);
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(pfinfo.company_name,40,90,{width:260,indent:40});
			doc.text(pfinfo.company_name,340,90,{width:260,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(pfinfo.customer.billing_address.landmark+","+pfinfo.customer.billing_address.barangay+","+pfinfo.customer.billing_address.city+","+pfinfo.customer.billing_address.province+","+pfinfo.customer.billing_address.country+","+pfinfo.customer.billing_address.zipcode,10,doc.y,{width:240,align:'justify'});
			doc.text(pfinfo.customer.shipping_address.landmark+","+pfinfo.customer.shipping_address.barangay+","+pfinfo.customer.shipping_address.city+","+pfinfo.customer.shipping_address.province+","+pfinfo.customer.shipping_address.country+","+pfinfo.customer.shipping_address.zipcode,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(pfinfo.sono,35,145);
			doc.text(pfinfo.pono,205,145);
			doc.text(pfinfo.refno,360,145);
			doc.text(pfinfo.ordered_by,520,145);
			doc.moveDown(0);
			y = doc.y;
			doc.text(pfinfo.payment_term,35);
			doc.text(pfinfo.delivery_date,220,y);
			doc.text(pfinfo.delivery_method,360,y);
			doc.text(pfinfo.sales_executive,500,y);
			doc.text(pfinfo.special_instruction,35,y+10);

			doc.font('Courier-Bold');
			doc.text("CODE",15,200);
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
		pageFooter : function(doc,pfinfo){
			doc.text(pfinfo.total_vat,130,646);/*VATable Sales*/
			doc.text(pfinfo.ttl_discount,130,658);/*Vat Exempt Sales*/
			doc.text(pfinfo.zero_rate_sales,130,670);/*Zero Rated Sales*/
			doc.text(pfinfo.total_vat,130,682);/*VAT AMOUNT*/
			doc.text(pfinfo.subtotal,560,646);/*Total Sales Vat inclusive*/
			doc.text(pfinfo.total_vat,560,658);/*Less Vat*/
			doc.text(pfinfo.total_vat,560,670);/*Amount Net of VAT*/
			doc.text(pfinfo.discount,560,682,{width:50});/*Less CS/PWD Discount*/
			doc.text(pfinfo.total_vat,560,694,{width:50});/*Amount Due*/
			doc.text(pfinfo.total_vat,560,706,{width:50});/*Add Vat*/
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(pfinfo.total_amount_due,560,718,{width:50});/*Total Amount Due*/
			doc.fontSize(10);
			doc.font('Courier');
			doc.text(pfinfo.order_created_by,25,755);
			doc.text(pfinfo.delivery_created_by,180,755);
			 return doc
		}
};

module.exports.print = function(pfinfo,result){

	var doc = pdf.pageSetting({
		info:{
		Title:pfinfo.pfno,
		Subject:pfinfo.pfno,
		Author:pfinfo.invoice_created_by
	}});
	var filename = __dirname.replace(path.sep+"pdf",path.sep+"public"+path.sep+"print")+path.sep+pfinfo.pfno+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,pfinfo);
	doc = pdf.pageFooter(doc,pfinfo);
	doc.y = 225;
	for(var i in pfinfo.ordered_items){
		var y= doc.y;
		doc.font('Courier');
	        doc.fontSize(8);
		doc.text(pfinfo.ordered_items[i].bl_code,3,y,{width:65});
		doc.text(pfinfo.ordered_items[i].name,70,y,{width:100});
		doc.text(pfinfo.ordered_items[i].description,175,y,{width:160});
		doc.text(pfinfo.ordered_items[i].quantity,340,y,{width:35,align:'center'});
		doc.text(pfinfo.ordered_items[i].uom,390,y,{width:50});
		doc.text(pfinfo.ordered_items[i].professional_price,440,y,{width:35,align:'center'});
		doc.text(pfinfo.ordered_items[i].price,480,y,{width:35,align:'center'});
		doc.text(pfinfo.ordered_items[i].total,530,y,{width:80,align:'center'});
		doc.moveDown(1);
		if(doc.y >= 620){
			doc.addPage();
			doc = pdf.pageHeader(doc,pfinfo);
			doc = pdf.pageFooter(doc,pfinfo);
			doc.y = 225;
		}
	}
	doc.end();
	result(null,"/print/"+pfinfo.pfno+'.pdf');
};
