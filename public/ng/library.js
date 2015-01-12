'use strict';

angular.module('erp')
.factory('Library', function (DTOptionsBuilder,DTColumnBuilder){
  return {
    DataTable : {
      options : function(api){
        var options = DTOptionsBuilder
        .fromSource(api)
        .withBootstrap()
        .withPaginationType('full_numbers')
        .withBootstrapOptions({
          TableTools: {
            classes: {
              container: 'btn-group',
              buttons: {
                normal: 'btn default'
              }
            }
          },
          ColVis: {
            classes: {
              masterButton: 'btn default'
            }
          }
        })
        .withColVis()
        .withColVisOption("buttonText","Columns")

        options.sScrollX = "100%";
        options.sScrollXInner = "100%";
        return options;
      },
      columns : function(columns,buttons){
        var dtcolumns = [];
        for(var i in columns){
          dtcolumns.push(DTColumnBuilder.newColumn(columns[i].name).withTitle(columns[i].title));
        }
        if(buttons.length){
          dtcolumns.push(DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
          .renderWith(function(data, type, full, meta) {
            var btnGroup = '<div class="btn-group btn-group-xs btn-group-solid style="min-width:150px;">';
            for(var i in buttons){
              if(buttons[i].exclude){
                if(data[buttons[i].exclude.key]){
                  btnGroup+='<a href="'+ buttons[i].url + data._id + '", class="tooltips btn default" data-container="body", data-placement="top", data-html="true", data-original-title="'+buttons[i].title+'"><i class="'+buttons[i].icon+'"></i></a>';
                }
              }
              else if(buttons[i].filter){
                if(!data[buttons[i].filter.key]){
                  btnGroup+='<a href="'+ buttons[i].url + data._id + '", class="tooltips btn default" data-container="body", data-placement="top", data-html="true", data-original-title="'+buttons[i].title+'"><i class="'+buttons[i].icon+'"></i></a>';
                }
              }
              else{
                btnGroup+='<a href="'+ buttons[i].url + data._id + '", class="tooltips btn default" data-container="body", data-placement="top", data-html="true", data-original-title="'+buttons[i].title+'"><i class="'+buttons[i].icon+'"></i></a>';
              }

            }
            btnGroup+='</div>';
            return btnGroup;
          }));
        }
        return dtcolumns;
      }
    },
    Compute : {
      Order : function(total,returnTotal,discount,isWithholdingTax,isVatZeroRated){
        total = total-returnTotal;
        var totalDiscount = total * discount;
        var vatableSales = total - totalDiscount;
        var taxAmount = total - (total / 1.12);
        var withholdingTax = isWithholdingTax ? (total * 0.01) : 0.00;
        var zeroRatedSales = isVatZeroRated ? total : 0.00;
        var totalAmountDue = isVatZeroRated ? (total - totalDiscount - withholdingTax - taxAmount) : (total - totalDiscount - withholdingTax);

        return {
          totalDiscount: totalDiscount,
          vatableSales: vatableSales,
          taxAmount : taxAmount,
          withholdingTax : withholdingTax,
          zeroRatedSales : zeroRatedSales,
          totalAmountDue : totalAmountDue
        };
      },
    },
    Permission : {
      isAllowed : function(client,path){
        var allowed = true;
        for(var i in client.permissions){
          if(path.indexOf(client.permissions[i].route) != -1){
            allowed = true;
          }
        }
        return allowed;
      }
    },
    Status : {

      Promo:{
        created : {status_code : "PROMO_CREATED", status_name : "Promo submitted"},
        approved : {status_code : "PROMO_APPROVED", status_name : "Promo approved"},
      },
      Cycle:{
        created : {status_code : "CYCLE_CREATED", status_name : "Cycle Count submitted"},
        approved : {status_code : "CYCLE_APPROVED", status_name : "Cycle Count approved"},
      },
      Merge:{
        created : {status_code : "MERGE_CREATED", status_name : "Merge submitted"},
        rejected : {status_code : "MERGE_REJECTED", status_name : "Merge rejecteded"},
        update : {status_code : "MERGE_UPDATED", status_name : "Update Merge Submitted"},
        approved : {status_code : "MERGE_APPROVED", status_name : "Merge approved"},
      },
      Schedule:{
          created : {status_code : "SCHEDULE_CREATED", status_name : "Schedule Submitted"},
          update : {status_code : "SCHEDULE_UPDATED", status_name : "Update Schedule Submitted"},
          rejected : {status_code : "SCHEDULED_REJECTED", status_name : "Schedule rejecteded"},
          approved : {status_code : "SCHEDULED_APPROVED", status_name : "Schedule approved"},
      },
      CDS:{
        created : {status_code : "CDS_CREATED", status_name : "Consignment Daily submitted"},
        approved : {status_code : "CDS_APPROVED", status_name : "Consignment Daily approved"},
      },
      Adjustment:{
        created : {status_code : "ADJUSTMENT_CREATED", status_name : "Adjustment submitted"},
        revised : {status_code : "ADJUSTMENT_REVISED", status_name : "Adjustment revised"},
        approved : {status_code : "ADJUSTMENT_APPROVED", status_name : "Adjustment approved"},
        override : {status_code : "ADJUSTMENT_OVERRIDE", status_name : "Adjustment for approval"},
      },
      Consignments:{
        order :{
          created : {status_code : "CONSIGNED_ORDER_CREATED", status_name : "Consigned-Order Created"},
          revised : {status_code : "CONSIGNED_ORDER_REVISED", status_name : "Consigned-Order revised"},
          approved : {status_code : "CONSIGNED_ORDER_APPROVED", status_name : "Consigned-Order approved"},
          update : {status_code : "CONSIGNED_ORDER_UPDATED", status_name : "Consigned-Order for approval"},
          rescheduled : {status_code : "CONSIGNED_ORDER_SCHEDULE_UPDATED", status_name : "Consigned-Delivery Schedule updated"}
        },
        packing :{
          created : {status_code : "PACKING_CREATED", status_name : "Warehouse-Order under preparation"}
        },
        delivery : {
          approved : {status_code : "CONSIGN_DELIVERY_RECEIPT_APPROVED", status_name : "Warehouse-Consign DR approved"},
          rejected : {status_code : "CONSIGN_DELIVERY_RECEIPT_REJECTED", status_name : "Warehouse-Consign DR rejected"}
        }
      },
      Shipments : {
        created  : {status_code : "SHIPMENT_CREATED", status_name : "Shipment submitted"},
        approved : {status_code : "SHIPMENT_APPROVED", status_name : "Shipment approved"},
        cancel : {status_code : "SHIPMENT_CANCEL", status_name : "Shipment cancelled"},
        updated : {status_code : "SHIPMENT_UPDATED", status_name : "Shipment updated"}
      },
      Purchases : {
        created  : {status_code : "PURCHASE_CREATED", status_name : "Purchase submitted"},
        approved : {status_code : "PURCHASE_APPROVED", status_name : "Purchase approved"},
        cancel : {status_code : "PURCHASE_CANCEL", status_name : "Purchase cancelled"},
        updated : {status_code : "PURCHASE_UPDATED", status_name : "Purchase updated"}
      },
      Sales : {
        order : {
          created : {status_code : "SALES_ORDER_CREATED", status_name : "Sales-Order submitted"},
          revised : {status_code : "SALES_ORDER_REVISED", status_name : "Sales-Order revised"},
          override : {status_code : "SALES_ORDER_OVERRIDE", status_name : "Sales-Order for approval"},
          rescheduled : {status_code : "SALES_ORDER_SCHEDULE_UPDATED", status_name : "Sales-Delivery Schedule updated"}
        },

        packing : {
          created : {status_code : "PACKING_CREATED", status_name : "Warehouse-Order under preparation"}
        },
        delivery : {
          approved : {status_code : "DELIVERY_RECEIPT_APPROVED", status_name : "Warehouse-DR approved"},
          rejected : {status_code : "DELIVERY_RECEIPT_REJECTED", status_name : "Warehouse-DR rejected"}
        },
        invoice : {
          approved : {status_code : "SALES_INVOICE_APPROVED", status_name : "Accounting-SI approved"},
          rejected : {status_code : "SALES_INVOICE_REJECTED", status_name : "Accounting-SI rejected"}
        },
        printed : {
          dr : {status_code : "DELIVERY_RECEIPT_PRINTED", status_name : "Warehouse-DR printed"},
          si : {status_code : "SALES_INVOICE_PRINTED", status_name : "Warehouse-SI printed"}
        },
        tripticket : {
          created : {status_code : "TRIP_TICKET_CREATED", status_name : "Warehouse-Delivery in progress"},
          delivered : {status_code : "TRIP_TICKET_DELIVERED", status_name : "Warehouse-Order delivered"},
          failed : {status_code : "TRIP_TICKET_FAILED", status_name : "Warehouse-Delivery failed"}
        },
        returned : {
          created : {status_code : "RETURN_CREATED", status_name : "Sales-Return submitted"},
          approved : {status_code : "RETURN_APPROVED", status_name : "Warehouse-Return approved"},
          rejected : {status_code : "RETURN_REJECTED", status_name : "Warehouse-Return rejected"},
          cancel : {status_code : "RETURN_CANCEL", status_name : "Warehouse-Return cancelled"}
        },
        memo : {
          approved : {status_code : "MEMO_APPROVED", status_name : "Accounting-Credit Memo Approved"},
          rejected : {status_code : "MEMO_REJECTED", status_name : "Accounting-Credit Memo Rejected"}
        },
        payment : {
          created : {status_code : "PAYMENT_CREATED", status_name : "Accounting-Payment created"},
          partialed : {status_code : "PAYMENT_PARTIALED", status_name : "Accounting-Partial Payment received"},
          updated : {status_code : "PAYMENT_UPDATED", status_name : "Accounting-Payment updated"},
          rejected : {status_code : "PAYMENT_REJECTED", status_name : "Accounting-Payment rejected"},
          confirmed : {status_code : "PAYMENT_CONFIRMED", status_name : "TRANSACTION COMPLETE"}
        },
        proforma : {
          created : {status_code : "PROFORMA_INVOICE_CREATED", status_name : "Sales-Pro Forma submitted"},
          approved : {status_code : "PROFORMA_INVOICE_APPROVED", status_name : "Accounting-Pro Forma approved"},
          rejected : {status_code : "PROFORMA_INVOICE_REJECTED", status_name : "Accounting-Pro Forma rejected"},
          override : {status_code : "PROFORMA_INVOICE_OVERRIDE", status_name : "Sales-Pro Forma for approval"},
          revised : {status_code : "PROFORMA_INVOICE_REVISED", status_name : "Sales-Pro Forma revised"},
          rescheduled : {status_code : "PROFORMA_INVOICE_SCHEDULE_UPDATED", status_name : "Sales-Delivery Schedule updated"}
        }
      }
    }
  }
});
