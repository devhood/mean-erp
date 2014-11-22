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

}).controller('UserCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api) {

  $scope.ajax_ready = false;
  Structure.Users.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.dtColumns = Library.DataTable.columns(columns,buttons);

    $scope.init = function(){
        columns = [
          $scope.structure.fullname, $scope.structure.username, $scope.structure.email,
          $scope.structure.phone, $scope.structure.position, $scope.structure.status
        ];

        buttons = [
          {url:"/#/user/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/user/edit/",title:"Edit Record",icon:"fa fa-edit"}
        ];
        $scope.title = "USERS"
        $scope.addUrl = "/#/user/add"
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/users");
    };
    $scope.formInit = function(){
      var id = $routeParams.id;
      if(id){
        $scope.title = "EDIT USER " + id;
        $scope.user =  Api.Collection('users').get({id:$routeParams.id});
        $scope.saveUser = function(){
          $scope.user.$update(function(){
            $location.path('/user/index');
            return false;
          });
        }
      }
      else{
        $scope.title = "ADD USER";

        var User = Api.Collection('users');
        $scope.user = new User();
        $scope.saveUser = function(){
          $scope.user.$save(function(){
            $location.path('/user/index');
            return false;
          });
        }
      }


    }
  });

}).controller('SalesCtrl', function ($scope, $window, $filter, $routeParams, Structure, Library, Api) {

  $scope.ajax_ready = false;
  Structure.Sales.query().$promise.then(function(data){
    $scope.structure = data[0];
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
              $scope.structure.sono, $scope.structure.customer, $scope.structure.sales_executive,
              $scope.structure.delivery_method, $scope.structure.payment_term, $scope.structure.status
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
            $scope.structure.sono, $scope.structure.customer, $scope.structure.sales_executive,
            $scope.structure.delivery_method, $scope.structure.payment_term, $scope.structure.status
          ];

          buttons = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/delivery/edit/",title:"Edit Record",icon:"fa fa-edit"},
            {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-edit"}
          ];
          query.status_code = {"$in" : [status.order.created]};
          $scope.title = "DELIVERY RECEIPTS"

        break;
        case "payment" :

          columns = [
          $scope.structure.sono, $scope.structure.customer, $scope.structure.sales_executive,
          $scope.structure.delivery_method, $scope.structure.payment_term, $scope.structure.status
          ];

          buttons = [
          {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/sales/delivery/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-edit"}
          ];
          query.status_code = {"$in" : [status.order.created]};
          $scope.title = "PAYMENTS"

          break;

      };
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
    };
  });
});
