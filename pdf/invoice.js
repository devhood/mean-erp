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

		pageHeader : function(doc,siinfo){
			doc.fontSize(14);
			doc.font('Courier-Bold');
			doc.text(siinfo.sino,500,75);
			doc.font('Courier');
			doc.fontSize(10);

			var fDate = new Date(siinfo.si_approved_date);
			date =(fDate.getMonth() + 1) + "/" + fDate.getDate() + "/" + fDate.getFullYear();

			doc.text(date,510,90,{align:'left'});
			doc.moveDown(0);
			doc.font('Courier-Bold');
			doc.fontSize(10);
			doc.text(siinfo.customer.company_name,40,110,{width:260,indent:40});
			doc.text(siinfo.customer.company_name,340,110,{width:260,indent:40});
			doc.moveDown(0);
			doc.font('Courier');
			doc.fontSize(10);
			var y = doc.y;
			doc.text(siinfo.customer.billing_address.landmark+","+siinfo.customer.billing_address.barangay+","+siinfo.customer.billing_address.city+","+siinfo.customer.billing_address.province+","+siinfo.customer.billing_address.country+","+siinfo.customer.billing_address.zipcode,10,doc.y,{width:240,align:'justify'});
			doc.text(siinfo.customer.shipping_address.landmark+","+siinfo.customer.shipping_address.barangay+","+siinfo.customer.shipping_address.city+","+siinfo.customer.shipping_address.province+","+siinfo.customer.shipping_address.country+","+siinfo.customer.shipping_address.zipcode,310,y,{width:240,align:'justify'});
			doc.moveDown(0);
			doc.text(siinfo.sono,35,165);
			if (siinfo.pono)	doc.text(siinfo.pono,205,165);
			if (siinfo.reference_no)	doc.text(siinfo.reference_no,360,165);
			doc.text(siinfo.ordered_by,520,165);
			doc.moveDown(0);
			y = doc.y;
			doc.text(siinfo.customer.payment_term,35);

			var dDate = new Date(siinfo.delivery_date);
			delivery_date =(dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();

			doc.text(delivery_date,220,y);
			doc.text(siinfo.delivery_method,360,y);
			doc.text(siinfo.customer.sales_executive,500,y);
			doc.text(siinfo.special_instruction,35,y+10);

			doc.font('Courier-Bold');
			doc.text("CODE",15,220);
			doc.text("PRODUCT",110,220);
			// doc.text("DESCRIPTION",205,200);
			doc.text("QTY",300,220);
			doc.text("UOM",395,220);
			doc.text("U/P",450,220);
			doc.text("DISCOUNT",480,220);
			doc.text("AMOUNT",540,220);
			doc.moveDown(1);
			return doc;
		},
		pageFooter : function(doc,siinfo){
			// siinfo.total_vat = siinfo.total_vat
			doc.text(siinfo.total_vat,130,622); /*VATable Sales*/
			doc.text("--",130,634); /*Vat Exempt Sales*/
			doc.text(siinfo.zero_rate_sales,130,646);/*Zero Rated Sales*/
			doc.text("--",130,658);/*VAT AMOUNT*/

			var total_sales = siinfo.total_amount_due.toFixed(2);
			var net_vat = (total_sales/1.12).toFixed(2);
			var less_vat = (total_sales - net_vat).toFixed(2);
			var add_vat = less_vat;

			doc.text(total_sales,460,622,{width:70,align:'right'});/*Total Sales Vat inclusive*/
			doc.text(less_vat,460,634,{width:70,align:'right'});/*Less Vat*/
			doc.text(net_vat,460,646,{width:70,align:'right'});/*Amount Net of VAT*/
			doc.text("--",460,658,{width:70,align:'right'});/*Less CS/PWD Discount*/
			doc.text(net_vat,460,670,{width:70,align:'right'});/*Amount Due*/
			doc.text(add_vat,460,682,{width:70,align:'right'});/*Add Vat*/
			doc.fontSize(14);
			doc.font('Courier-Bold');

			// var num = siinfo.total_amount_due;
			// var total = num.toFixed(2);
			// var total = siinfo.total_amount_due.toFixed(2);
			doc.text(total_sales,460,694);/*Total Amount Due*/
			doc.fontSize(10);
			doc.font('Courier');
			if (siinfo.dr_approved_by) doc.text(siinfo.dr_approved_by,25,730);
			if (siinfo.si_approved_by) doc.text(siinfo.si_approved_by,180,730);
			 return doc
		}
};

module.exports.print = function(siinfo,result){

	var doc = pdf.pageSetting({
		info:{
		Title:siinfo.sino,
		Subject:siinfo.sino,
		Author:siinfo.invoice_created_by
	}});
	var filename = __dirname.replace(path.sep+"pdf",path.sep+"public"+path.sep+"print")+path.sep+siinfo.sino+'.pdf';
	doc.pipe(fs.createWriteStream(filename));

	doc = pdf.pageHeader(doc,siinfo);
	doc = pdf.pageFooter(doc,siinfo);
	doc.y = 255;
	for(var i in siinfo.ordered_items){
		var y= doc.y;
		doc.font('Courier');
	        doc.fontSize(8);
		doc.text(siinfo.ordered_items[i].bl_code,15,y,{width:80});
		doc.text(siinfo.ordered_items[i].name,100,y,{width:150});
		// doc.text(siinfo.ordered_items[i].description,175,y,{width:160});
		doc.text(siinfo.ordered_items[i].quantity,300,y,{width:35,align:'center'});
		doc.text(siinfo.ordered_items[i].uom,390,y,{width:50});
		doc.text(siinfo.ordered_items[i].professional_price,440,y,{width:35,align:'center'});
		if(siinfo.ordered_items[i].professional_price != siinfo.ordered_items[i].price)
			doc.text(siinfo.ordered_items[i].price,480,y,{width:35,align:'center'});
		else
			doc.text("",480,y,{width:35,align:'center'});
		doc.text(siinfo.ordered_items[i].total,530,y,{width:80,align:'center'});
		doc.moveDown(1);
		if(doc.y >= 620){
			doc.addPage();
			doc = pdf.pageHeader(doc,siinfo);
			doc = pdf.pageFooter(doc,siinfo);
			doc.y = 255;
		}
	}
	doc.end();
	result(null,"/print/"+siinfo.sino+'.pdf');
};
