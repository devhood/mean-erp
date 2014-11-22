'use strict';

angular.module('erp')
.controller('MainCtrl', function ($scope, $location, Reference, Session) {
  $scope.menus = Reference.Menu.query();
  Session.get(function(client){
    $scope.client = client;
  });
}).controller('UserCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  $scope.ajax_ready = false;
  Structure.Users.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
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
      var action = $routeParams.action;
      $scope.positions = Api.Collection('positions').query();
      $scope.statuses = Api.Collection('user_status').query();

      $scope.action = action;
      if(id && action == 'read'){
        $scope.title = "VIEW USER " + id;
        $scope.user =  Api.Collection('users').get({id:$routeParams.id});
      }
      if(id && action == 'edit'){
        $scope.title = "EDIT USER " + id;
        $scope.user =  Api.Collection('users').get({id:$routeParams.id});
        $scope.saveUser = function(){
          $scope.user.$update(function(){
            $location.path('/user/index');
            return false;
          });
        };
        $scope.deleteUser=function(user){
          if(popupService.showPopup('You are about to delete Record : '+user._id)){
            $scope.user.$delete(function(){
              $location.path('/user/index');
              return false;
            });
          }
        };
      }
      if(action == 'add'){
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
}).controller('CustomerCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  $scope.ajax_ready = false;
  Structure.Customers.query().$promise.then(function(data){
      $scope.structure = data[0];
      $scope.ajax_ready = true;
      var columns = [];
      var buttons = [];
      var query = {};
      $scope.init = function(){
        columns = [
          $scope.structure.type, $scope.structure.company_name, $scope.structure.branch,
          $scope.structure.credit_limit, $scope.structure.payment_term,
          $scope.structure.sales_executive, $scope.structure.status
        ];

        buttons = [
          {url:"/#/customer/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/customer/edit/",title:"Edit Record",icon:"fa fa-edit"}
        ];
        $scope.title = "CUSTOMER"
        $scope.addUrl = "/#/customer/add"
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/customers");
      };
      $scope.formInit = function(){

        var id = $routeParams.id;
        var action = $routeParams.action;
        $scope.customer_types = Api.Collection('customer_type').query();
        $scope.payment_terms = Api.Collection('payment_term').query();
        $scope.discounts = Api.Collection('discounts').query();
        $scope.shipping_modes = Api.Collection('shipping_mode').query();
        $scope.price_types = Api.Collection('price_type').query();
        $scope.customer_status = Api.Collection('customer_status').query();
        $scope.countries = Api.Collection('countries').query();
        $scope.geographys = Api.Collection('geography').query();
        var query = {"position":"Sales Executive"};
        $scope.sales_executives = Api.Collection('users',query).query(function(){});

        $scope.copyShipping = function(customer){
          if(customer.shipping_address && customer.shipping_address.same){
            $scope.customer.billing_address = customer.shipping_address;
          }
        };
        $scope.addContact = function(customer){
          console.log("chito");
          if(customer.contact && customer.contact.name && customer.contact.position && customer.contact.phone && customer.contact.email ){
            console.log("chito");
            if($scope.customer.contacts){
              $scope.customer.contacts.push(customer.contact);
            }
            else{
              $scope.customer.contacts = [customer.contact];
            }
            customer.contact = {};
          }
        }
        $scope.removeContact = function(index){
          $scope.customer.contacts.splice(index, 1);
        }

        $scope.action = action;
        if(id && action == 'read'){
          $scope.title = "VIEW CUSTOMER " + id;
          $scope.customer =  Api.Collection('customers').get({id:$routeParams.id});
        }
        if(id && action == 'edit'){
          $scope.title = "EDIT CUSTOMER " + id;
          $scope.customer =  Api.Collection('customers').get({id:$routeParams.id});
          $scope.saveCustomer = function(){
            $scope.customer.$update(function(){
              $location.path('/customer/index');
              return false;
            });
          };
          $scope.deleteCustomer=function(customer){
            if(popupService.showPopup('You are about to delete Record : '+customer._id)){
              $scope.customer.$delete(function(){
                $location.path('/customer/index');
                return false;
              });
            }
          };
        }
        if(action == 'add'){
          $scope.title = "ADD CUSTOMER";

          var Customer = Api.Collection('customers');
          $scope.customer = new Customer();
          $scope.saveCustomer = function(){
            $scope.customer.$save(function(){
              $location.path('/customer/index');
              return false;
            });
          }
        }
      }

  });
}).controller('ProductCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  $scope.ajax_ready = false;
  Structure.Customers.query().$promise.then(function(data){
      $scope.structure = data[0];
      $scope.ajax_ready = true;
      var columns = [];
      var buttons = [];
      var query = {};
      $scope.init = function(){
        columns = [
          $scope.structure.bl_code, $scope.structure.Brand, $scope.structure.Item_name,
          $scope.structure.Size, $scope.structure.Color,
          $scope.structure.UOM, $scope.structure.Supplier_code, $scope.structure.Supplier_code, $scope.structure.Status
        ];
        buttons = [
          {url:"/#/product/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/product/edit/",title:"Edit Record",icon:"fa fa-edit"}
        ];
      }
      $scope.title = "PRODUCT"
      $scope.addUrl = "/#/product/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/product");
    )};
  });
  $scope.dtColumns = Library.DataTable.columns(columns,buttons);

}).controller('SalesCtrl', function ($scope, $window, $filter, $routeParams, Structure, Library, Api) {

  $scope.ajax_ready = false;
  Structure.Sales.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var status = Library.Status.Sales;
    var columns = [];
    var buttons = [];
    var query = {};

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
