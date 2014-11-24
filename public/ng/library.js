'use strict';

angular.module('erp')
.factory('Library', function (DTOptionsBuilder,DTColumnBuilder){
  return {
    DataTable : {
      options : function(api){
        var options = DTOptionsBuilder
        .fromSource(api)
        .withBootstrap()
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
        options.bPaginate = false;
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
            var btnGroup = '<div class="btn-group btn-group-xs btn-group-solid">';
            for(var i in buttons){
              btnGroup+='<a href="'+ buttons[i].url + data._id + '", class="tooltips btn default" data-container="body", data-placement="top", data-html="true", data-original-title="'+buttons[i].title+'"><i class="'+buttons[i].icon+'"></i></a>';
            }
            btnGroup+='</div>';
            return btnGroup;
          }));
        }
        return dtcolumns;
      }
  },
  Compute : {
      Order : function(total,discount,isWithholdingTax,isVatZeroRated){
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
      }
  },
  Status : {
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
      tripticket : {
        created : {status_code : "TRIP_TICKET_CREATED", status_name : "Warehouse-Delivery in progress"},
        delivered : {status_code : "TRIP_TICKET_DELIVERED", status_name : "Warehouse-Order delivered"},
        failed : {status_code : "TRIP_TICKET_FAILED", status_name : "Warehouse-Delivery failed"}
      },
      returned : {
        created : {status_code : "RETURN_CREATED", status_name : "Sales-Return submitted"},
        approved : {status_code : "RETURN_APPROVED", status_name : "Warehouse-Return approved"},
        cancel : {status_code : "RETURN_CANCEL", status_name : "Warehouse-Return cancelled"}
      },
      memo : {
        approved : {status_code : "MEMO_APPROVED", status_name : "Accounting-Credit Memo Approved"},
        rejected : {status_code : "MEMO_REJECTED", status_name : "Accounting-Credit Memo Rejected"}
      },
      payment : {
        created : {status_code : "PAYMENT_CREATED", status_name : "Accounting-Payment received"},
        updated : {status_code : "PAYMENT_UPDATED", status_name : "Accounting-Payment updated"},
        confirmed : {status_code : "PAYMENT_CONFIRMED", status_name : "TRANSACTION COMPLETE"}
      },
      proforma : {
        created : {status_code : "PROFORMA_INVOICE_CREATED", status_name : "Sales-Pro Forma submitted"},
        approved : {status_code : "PROFORMA_INVOICE_APPROVED", status_name : "Accounting-Pro Forma approved"},
        rejected : {status_code : "PROFORMA_INVOICE_REJECTED", status_name : "Accounting-Pro Forma rejected"},
        revised : {status_code : "PROFORMA_INVOICE_REVISED", status_name : "Sales-Pro Forma revised"},
        rescheduled : {status_code : "PROFORMA_INVOICE_SCHEDULE_UPDATED", status_name : "Sales-Delivery Schedule updated"}
      }
    }
  }
}
});
