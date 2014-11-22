'use strict';

angular.module('erp')
.controller('MainCtrl', function ($scope, $location, Reference, Session) {
  $scope.menus = Reference.Menu.query();
  Session.get(function(client){
    $scope.client = client;
  });
})
.controller('ProductCtrl', function ($scope,$window, $filter,Library) {

  $scope.dtOptions = Library.DataTable.options('/api/products');
  var columns = [
  {name:"product_code",title:"BL Code"},
  {name:"brand",title:"Brand"},
  {name:"name",title:"Item Name"},
  {name:"size",title:"Size"},
  {name:"color",title:"Color"},
  {name:"payment_term",title:"Payment Terms"},
  {name:"uom",title:"UOM"},
  {name:"movement",title:"Movement"},
  {name:"description",title:"Description"},
  {name:"supplier",title:"Supplier"},
  {name:"status",title:"Status"}
  ];
  var buttons = [
  {url:"/#/product/read/",title:"View Record",icon:"fa fa-folder-open"},
  {url:"/#/product/edit/",title:"Edit Record",icon:"fa fa-edit"}
  ];
  $scope.dtColumns = Library.DataTable.columns(columns,buttons);
})
.controller('CustomerCtrl', function ($scope,$window, $filter,Library) {

  $scope.dtOptions = Library.DataTable.options('/api/customers');
  var columns = [
  {name:"company_name",title:"Customer"},
  {name:"branch_name",title:"Branch"},
  {name:"credit_limit",title:"Credit Limit"},
  {name:"transaction_limit",title:"Transaction Limit"},
  {name:"payment_term",title:"Payment Terms"},
  {name:"sales_executive",title:"Sales Executive"},
  {name:"status",title:"Status"},
  ];
  var buttons = [
  {url:"/#/customer/read/",title:"View Record",icon:"fa fa-folder-open"},
  {url:"/#/customer/edit/",title:"Edit Record",icon:"fa fa-edit"},
  {url:"/#/customer/approve/",title:"Approve Record",icon:"fa fa-edit"}
  ];
  $scope.dtColumns = Library.DataTable.columns(columns,buttons);

}).controller('UserCtrl', function ($scope,$window, $filter,Library) {

  $scope.dtOptions = Library.DataTable.options('/api/users');

  var columns = [
  {name:"fullname",title:"Fullname"},
  {name:"username",title:"Username"},
  {name:"position",title:"Position"},
  {name:"phone",title:"Phone"},
  {name:"email",title:"Email"},
  {name:"status",title:"Status"}
  ];

  var buttons = [
  {url:"/#/users/read/",title:"View Record",icon:"fa fa-folder-open"},
  {url:"/#/users/edit/",title:"Edit Record",icon:"fa fa-edit"},
  {url:"/#/users/approve/",title:"Approve Record",icon:"fa fa-edit"}
  ];

  $scope.dtColumns = Library.DataTable.columns(columns,buttons);

}).controller('SalesCtrl', function ($scope, $window, $filter, $routeParams, Reference, Library, DTColumnBuilder) {

  //var sales = Reference.Sales.query(); // Reference.Menu.query();
  $scope.ajax_ready = false;
  $scope.sales = {};
  Reference.Sales.query().$promise.then(function(data){
    $scope.sales = data[0];
    $scope.ajax_ready = true;
    var status = Library.Status.Sales;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.dtColumns = Library.DataTable.columns(columns,buttons);

    $scope.init = function(){
      var type = $routeParams.type;
      switch(type){
        case "order" :

            columns = [
              $scope.sales.sono, $scope.sales.customer, $scope.sales.sales_executive,
              $scope.sales.delivery_method, $scope.sales.payment_term, $scope.sales.status
            ];

            buttons = [
              {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/order/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/sales/order/approve/",title:"Approve Record",icon:"fa fa-edit"}
            ];
            query.status_code = {"$in" : [status.order.created]};
            $scope.title = "SALES ORDERS"
            $scope.addUrl = "/#/sales/order/add"

        break;
        case "delivery" :

          columns = [
            $scope.sales.sono, $scope.sales.customer, $scope.sales.sales_executive,
            $scope.sales.delivery_method, $scope.sales.payment_term, $scope.sales.status
          ];

          buttons = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/delivery/edit/",title:"Edit Record",icon:"fa fa-edit"},
            {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-edit"}
          ];
          query.status_code = {"$in" : [status.order.created]};
          $scope.title = "DELIVERY RECEIPTS"

        break;

      };
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
    };
  });
});
