//  fixes
//  fix payment status : set apart the status when delivered in trip ticket
  when: trip ticket-  delivered

**** payment reports
1 completed
2 ar reports


//reports
customizable: the user can determine the parameters
date x to date y
by brand



**** customer/product profile : dont replace, put history
**** memorandum

**** 3-17-15 deadline for memo: with company manual without loging in;
**** +3 days for SL VL OT

//calendar
*** no deletion in calendar
*** red highlight for canceled
*** marker for SE booked
*** format for ms dina
*** button for list log of actions
date tme user action
date time event

others can tentatively booked
//

//warehouse
**
** test cycle count in warehouse;






// add
// color club profiles
//upload PP - CG and Ardell v2



// cache for website
// https://github.com/goodeggs/angular-cached-resource
// https://www.npmjs.com/package/node-cache


//adjustment
, ng-selected="{{adjustments.adjustment_transaction_type}}"
ng-options="adjustment_transaction_type.name as adjustment_transaction_type.name for adjustment_transaction_type  in adjustment_transaction_types track by adjustment_transaction_type.name"


extract sales:
  sino, drno, sino, customer, city

  sino, drno, sino, customer,
    brand total


//pldt evaline catigbak 09213835770 8364140

var fDate = new Date("2015-02-04T05:33:34.949Z");
// d. = ;
// var n = d.toLocaleDateString("en-US");
// var n = d.toDateString("en-US");

console.log((fDate.getMonth() + 1) + "/" + fDate.getDate() + "/" + fDate.getFullYear()+"  "+  fDate.getHours()+":"+fDate.getMinutes()+":"+fDate.getSeconds());


///\
new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')




















*** CODE BIN ***

 // else if ($scope.report.period && $scope.report.value || $scope.report.year) {
    //   var period = $scope.report.period;
    //   var value = $scope.report.value;
    //   var start_year = 1;
    //   var start_month = 0;
    //   var start_day = 1;
    //   var start_hours = 0;
    //   var start_minute = 0;

    // var splitDate = function () {
    //    start_year = Number($scope.report.value.split("/")[2]);
    //    start_month = Number($scope.report.value.split("/")[0])-1;
    //    start_day = Number($scope.report.value.split("/")[1]);
    //   }

    // switch (period) {
    //   case 'day':
    //     splitDate();
    //     var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
    //     var end_date = new Date(start_year,start_month,start_day+1,start_hours,start_minute);
    //     if (start_date == "Invalid Date") {
    //       window.alert("Invalid input, please check the date format.");
    //     }
    //     query.payment_date = {"$gte": start_date, "$lte": end_date};
    //     console.log("query : ", JSON.stringify(query));
    //     $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    //   break;
    //   case 'week':
    //     splitDate();
    //     var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
    //     var end_date = new Date(start_year,start_month,start_day+7,start_hours,start_minute);
    //     if (start_date == "Invalid Date") {
    //       window.alert("Invalid input, please check the date format.");
    //     }
    //     query.payment_date = {"$gte": start_date, "$lte": end_date};
    //     console.log("query : ", JSON.stringify(query));
    //     $scope.title = "SALES REPORT : WEEKLY"
    //     $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    //   break;
    //   case 'month':
    //     start_day = 1;
    //     start_month = $scope.report.value;
    //     start_year = $scope.report.year;
    //   console.log(start_year, start_month, start_day);
    //     var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
    //   console.log(start_year, start_month, start_day);
    //     if (start_month==12) {
    //       start_month = 0;
    //       start_year = start_year + 1;
    //     }
    //     var end_date = new Date(start_year,start_month+1,start_day,start_hours,start_minute);
    //   console.log(end_date);
    //     if (start_date == "Invalid Date") {
    //       window.alert("Invalid input, please check the date format.");
    //     }
    //     query.payment_date = {"$gte": start_date, "$lte": end_date};
    //     console.log("query nga : ", JSON.stringify(query));
    //
    //     $scope.dtColumns = Library.DataTable.columns(columns,buttons);
    //     $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    //   break;
    //   case 'quarter':
    //     start_year = $scope.report.year;
    //     switch ($scope.report.quarter) {
    //     case '1':
    //       start_month = 0;
    //       break;
    //     case '2':
    //       start_month = 3;
    //       break;
    //     case '3':
    //       start_month = 6;
    //       break;
    //     case '4':
    //       start_month = 9;
    //       break;
    //     default:
    //       window.confirm("The Quarter is out of range.");
    //     }
    //
    //     if (start_year < 2010 || start_year > 2020 ) {
    //       window.confirm("The Year is out of range.");
    //     }
    //     var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
    //     start_month = start_month==12 ? 0 : start_month;
    //     var end_date = new Date(start_year,start_month+3,start_day,start_hours,start_minute);
    //     if (start_date == "Invalid Date") {
    //       window.alert("Invalid input, please check the date format.");
    //     }
    //     query.payment_date = {"$gte": start_date, "$lte": end_date};
    //     console.log("query : ", JSON.stringify(query));
    //     $scope.dtColumns = Library.DataTable.columns(columns,buttons);
    //     $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    //   break;
    //   case 'annual':
    //     var start_year = $scope.report.year;
    //     if (start_year < 2010 || start_year > 2020 ) {
    //       window.confirm("The Year is out of range.");
    //     }
    //     var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
    //     start_month = start_month==12 ? 0 : start_month;
    //     var end_date = new Date(start_year,start_month+12,start_day,start_hours,start_minute);
    //     if (start_date == "Invalid Date") {
    //       window.alert("Invalid input, please check the date format.");
    //     }
    //     query.payment_date = {"$gte": start_date, "$lte": end_date};
    //     console.log("query : ", JSON.stringify(query));
    //     $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    //   break;
    //   default:
    //   break;
    //   }
    // }

    _____

    //- .col-md-4
        .form-group
            select.select2me.form-control.select2-offscreen(ng-model="report.period", ng-options="period.name as period.name for period in report_periods")
            span.col-md-12.help-block Select Reports by Period
    //- .col-md-8
    //- .col-md-4
      .form-group
        .col-md-12(ng-show="report.period=='day'")
          input.form-control(type="text", ng-model="report.value")
          span.col-md-12.help-block Enter Starting Date
        .col-md-12(ng-show="report.period=='week'")
          input.form-control(type="text", ng-model="report.value")
          span.col-md-12.help-block Enter Starting Date of Week
        .col-md-12(ng-show="report.period=='month'")
          input.form-control(type="text", ng-model="report.value")
          span.col-md-12.help-block Enter Month
        .col-md-12
          .col-md-6(ng-show="report.period=='annual' || report.period=='quarter' || report.period=='month'")
            input.form-control(type="text", ng-model="report.year")
            span.col-md-12.help-block Enter Year
          .col-md-4(ng-show="report.period=='quarter'")
            input.form-control(type="text", ng-model="report.quarter")
            span.col-md-12.help-block Enter Quarter
          .col-md-2





EWB
gigi baustista
226 4095
