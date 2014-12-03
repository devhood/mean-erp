'use strict';

angular.module('erp')
.controller('MainCtrl', function ($scope, $location, Reference, Session) {
  $scope.menus = Reference.Menu.query();
  Session.get(function(client){
    $scope.client = client;
  });
})
.controller('UserCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

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
      $scope.permissions = Api.Collection('permissions').query();

      $scope.addPermission = function(user){
        if(user.permission && user.permission.name && user.permission.allowed){
          if($scope.user.permissions){
            delete user.permission._id;
            $scope.user.permissions.push(user.permission);
          }
          else{
            $scope.user.permissions = [user.permission];
          }
          delete user.permission;
        }
      };

      $scope.removePermission = function(index){
        $scope.user.permissions.splice(index, 1);
      };

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
})
.controller('CustomerCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

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
          $scope.structure.sales_executive, $scope.structure.status
        ];

        buttons = [
          {url:"/#/customer/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/customer/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/customer/approve/",title:"Approve Record",icon:"fa fa-gear"}
        ];
        $scope.title = "CUSTOMER"
        $scope.addUrl = "/#/customer/add"
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/customers");
      };
      $scope.formInit = function(){

        var id = $routeParams.id;
        var action = $routeParams.action;
        $scope.customer_types = Api.Collection('customer_types').query();
        $scope.payment_terms = Api.Collection('payment_terms').query();
        $scope.discounts = Api.Collection('discounts').query();
        $scope.delivery_methods = Api.Collection('delivery_methods').query();
        $scope.price_types = Api.Collection('price_types').query();
        $scope.customer_status = Api.Collection('customer_status').query();
        $scope.countries = Api.Collection('countries').query();
        $scope.provinces = Api.Collection('provinces').query();

        $scope.provinces.$promise.then(function(data){
          $scope.cities = [];
          for(var i=0;i<$scope.provinces.length;i++){
            $scope.cities = $scope.cities.concat($scope.provinces[i].cities);
          }
          $scope.bcities = $scope.cities;
          $scope.scities = $scope.cities;
          $scope.zipcodes = [];
          for(var i=0;i<$scope.cities.length;i++){
            $scope.zipcodes = $scope.zipcodes.concat($scope.cities[i].zipcodes);
          }
          $scope.bzipcodes = $scope.zipcodes;
          $scope.szipcodes = $scope.zipcodes;

        });

        var query = {"position":"Sales Executive"};
        $scope.sales_executives = Api.Collection('users',query).query();

        $scope.copyShipping = function(){
          if($scope.customer.shipping_address && $scope.customer.shipping_address.same){
            $scope.temp_billing_address = $scope.customer.billing_address;
            $scope.bzipcodes = $scope.szipcodes;
            $scope.customer.billing_address = angular.copy($scope.customer.shipping_address);

          }
        };

        $scope.addContact = function(customer){
          if(customer.contact && customer.contact.name && customer.contact.position && customer.contact.phone && customer.contact.email ){
            if($scope.customer.contacts){
              $scope.customer.contacts.push(customer.contact);
            }
            else{
              $scope.customer.contacts = [customer.contact];
            }
            delete customer.contact;
          }
        }

        $scope.removeContact = function(index){
          $scope.customer.contacts.splice(index, 1);
        }

        $scope.CityChange = function(key,value){
          if($scope.customer.shipping_address && !$scope.customer.shipping_address.same){
            var cities = $scope.cities.filter(function(val){
              return val.city === value;
            });
            $scope[key] = cities[0].zipcodes;
          }
        }

        $scope.ProvinceChange = function(key,value){
          if($scope.customer.shipping_address && !$scope.customer.shipping_address.same){
            var province = $scope.provinces.filter(function(val){
              return val.province === value;
            });
            $scope[key] = province[0].cities;
          }
        }



        $scope.action = action;
        if(id && action == 'read'){
          $scope.title = "VIEW CUSTOMER " + id;
          $scope.customer =  Api.Collection('customers').get({id:$routeParams.id});
        }
        if(id && action == 'edit'){
          $scope.title = "EDIT CUSTOMER " + id;
          $scope.customer =  Api.Collection('customers').get({id:$routeParams.id});
          $scope.province_ng_option = "geography.province for geography in geographys track by customer.billing_address.province";
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
        if(id && action == 'approve'){
          $scope.title = "APPROVE CUSTOMER " + id;
          $scope.customer =  Api.Collection('customers').get({id:$routeParams.id});
          $scope.province_ng_option = "geography.province for geography in geographys track by customer.billing_address.province";
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
})
.controller('ProductCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService, fileUpload) {

  $scope.ajax_ready = false;
  Structure.Products.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.init = function(){
      columns = [
      $scope.structure.bl_code, $scope.structure.name, $scope.structure.brand,
      $scope.structure.size, $scope.structure.color, $scope.structure.payment_term
      ];

      buttons = [
      {url:"/#/product/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/product/edit/",title:"Edit Record",icon:"fa fa-edit"}
      ];
      $scope.title = "PRODUCTS"
      $scope.addUrl = "/#/product/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/products");
    };
    $scope.formInit = function(){

      var id = $routeParams.id;
      var action = $routeParams.action;
      $scope.brands = Api.Collection('brands').query();
      $scope.uoms = Api.Collection('uoms').query();
      $scope.payment_terms = Api.Collection('payment_terms').query();
      $scope.product_status = Api.Collection('product_status').query();
      var query = {"type":"Retail"};
      $scope.inventory_locations = Api.Collection('customers',query).query();
      $scope.movements = Api.Collection('movements').query();
      $scope.suppliers = Api.Collection('suppliers').query();
      var query = {"uom":{"$ne":"Package"}};
      $scope.products = Api.Collection('products',query).query();

      $scope.addPackage = function(product){
        if( product.package && product.package.name && product.package.quantity ){
          delete product.package.inventories;
          if($scope.product.packages){
            $scope.product.packages.push(product.package);
          }
          else{
            $scope.product.packages = [product.package];
          }
          delete product.package;
        }
      }

      $scope.removePackage = function(index){
        $scope.product.packages.splice(index, 1);
      }

      $scope.addInventory = function(product){
        if( product.inventory && product.inventory.company_name && product.inventory.quantity ){
          var content = {
            _id: product.inventory._id,
            company_name: product.inventory.company_name,
            branch: product.inventory.branch,
            price_type: product.inventory.price_type,
            shipping_address: product.inventory.shipping_address,
            quantity: product.inventory.quantity
          };

          if($scope.product.inventories){
            $scope.product.inventories.push(content);
          }
          else{
            $scope.product.inventories = [content];
          }
          delete product.inventory;
        }
      }

      $scope.removeInventory = function(index){
        $scope.product.inventories.splice(index, 1);
      }

      $scope.action = action;
      if(id && action == 'read'){
        $scope.title = "VIEW PRODUCT " + id;
        $scope.product =  Api.Collection('products').get({id:$routeParams.id},function(){
          $scope.product.product_photo = $scope.product.product_photo ? "/uploads/"+$scope.product.product_photo  : "http://www.placehold.it/400x300/EFEFEF/AAAAAA&text=no+image";
        });

      }
      if(id && action == 'edit'){
        $scope.title = "EDIT PRODUCT " + id;
        $scope.product =  Api.Collection('products').get({id:$routeParams.id},function(){
          $scope.product.product_photo = $scope.product.product_photo ? "/uploads/"+$scope.product.product_photo  : "http://www.placehold.it/400x300/EFEFEF/AAAAAA&text=no+image";
        });
        $scope.saveProduct = function(){
          var product_photo = $scope.product.product_photo;
          delete $scope.product.product_photo;
          $scope.product.$update(function(){
            if(product_photo.name){
              var uploadUrl = '/api/products/'+id+'/upload';
              fileUpload.uploadFileToUrl('product_photo',product_photo, uploadUrl);
            }

            $location.path('/product/index');
            return false;
          });
        };
        $scope.deleteProduct=function(product){
          if(popupService.showPopup('You are about to delete Record : '+product._id)){
            $scope.product.$delete(function(){
              $location.path('/product/index');
              return false;
            });
          }
        };
      }
      if(id && action == 'approve'){
        $scope.title = "APPROVE PRODUCT " + id;
        $scope.product =  Api.Collection('products').get({id:$routeParams.id},function(){
          $scope.product.product_photo = $scope.product.product_photo ? "/uploads/"+$scope.product.product_photo  : "http://www.placehold.it/400x300/EFEFEF/AAAAAA&text=no+image";
        });
        $scope.saveProduct = function(){
          var product_photo = $scope.product.product_photo;
          delete $scope.product.product_photo;
          $scope.product.$update(function(){
            if(product_photo.name){
              var uploadUrl = '/api/products/'+id+'/upload';
              fileUpload.uploadFileToUrl('product_photo',product_photo, uploadUrl);
            }
            $location.path('/product/index');
            return false;
          });

        };
        $scope.deleteProduct=function(user){
          if(popupService.showPopup('You are about to delete Record : '+product._id)){
            $scope.product.$delete(function(){
              $location.path('/product/index');
              return false;
            });
          }
        };
      }
      if(action == 'add'){
        $scope.title = "ADD PRODUCT";
        var Product = Api.Collection('products');
        $scope.product = new Product();
        $scope.product.product_photo = "http://www.placehold.it/400x300/EFEFEF/AAAAAA&text=no+image";
        $scope.saveProduct = function(){
          var product_photo = $scope.product.product_photo;
          delete $scope.product.product_photo;
          $scope.product.$save(function(){
            var uploadUrl = '/api/products/'+$scope.product._id+'/upload';
            fileUpload.uploadFileToUrl('product_photo',product_photo, uploadUrl);
            $location.path('/product/index');
            return false;
          });
        }
      }
    }
  });

})
.controller('SalesCtrl', function ($scope, $window, $filter, $routeParams, Structure, Library, Api) {

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
        case "proforma" :

            columns = [
              $scope.structure.pfno, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/proforma/edit/",title:"Edit Record",icon:"fa fa-edit"}
            ];

            query = { "status.status_code" : {"$in" : [status.proforma.created.status_code,status.proforma.revised.status_code]}};
            $scope.title = "PROFORMA INVOICE"
            $scope.addUrl = "/#/sales/proforma/add";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "order" :

            columns = [
              $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/order/edit/",title:"Edit Record",icon:"fa fa-edit"}
            ];

            query = { "status.status_code" : {"$in" : [status.order.created.status_code,status.order.override.status_code]}};
            $scope.title = "SALES ORDERS"
            $scope.addUrl = "/#/sales/order/add";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "override" :

          columns = [
            $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          buttons = [
            {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/order/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];

          query = { "status.status_code" : {"$in" : [status.order.override.status_code]}};
          $scope.title = "APPROVE SALES ORDERS";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "delivery" :

          columns = [
            $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          buttons = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];

          query = { "status.status_code" : {"$in" : [status.packing.created.status_code]}};
          $scope.title = "DELIVERY RECEIPTS";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          var columns1 = [
          $scope.structure.sono,$scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          var buttons1 = [
          {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"}
          ];

          query = { "status.status_code" : {"$in" : [status.delivery.approved.status_code]}};
          $scope.title1 = "APPROVED DELIVERY RECEIPTS";

          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "invoice" :

          columns = [
          $scope.structure.sono,$scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          buttons = [
          {url:"/#/sales/invoice/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/sales/invoice/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];

          query = { "status.status_code" : {"$in" : [status.delivery.approved.status_code]}};
          $scope.title = "SALES INVOICE";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          var columns1 = [
          $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          var buttons1 = [
          {url:"/#/sales/invoice/read/",title:"View Record",icon:"fa fa-folder-open"}
          ];

          query = { "status.status_code" : {"$in" : [status.invoice.approved.status_code]}};
          $scope.title1 = "APPROVED SALES INVOICE";

          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;

        case "return" :

          columns = [
          $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          buttons = [
          {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/sales/return/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];

          query = { "status.status_code" : {"$in" : [status.invoice.approved.status_code]}};
          $scope.title = "RETURN MERCHANDISE RECEIPT";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          var columns1 = [
          $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];

          var buttons1 = [
          {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"}
          ];

          query = { "status.status_code" : {"$in" : [status.returned.approved.status_code]}};
          $scope.title1 = "APPROVED RETURN MERCHANDISE RECEIPTE";

          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          break;
      }
    };

  });
})
.controller('SalesOrderCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.products = Api.Collection('products').query();
  var status = Library.Status.Sales;

  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
          $scope.sales.customer.shipping_address.landmark + ', ' +
          $scope.sales.customer.shipping_address.barangay + ', ' +
          $scope.sales.customer.shipping_address.city + ', ' +
          $scope.sales.customer.shipping_address.province + ', ' +
          $scope.sales.customer.shipping_address.country + ', ' +
          $scope.sales.customer.shipping_address.zipcode;
      $scope.billing_address =
          $scope.sales.customer.billing_address.landmark + ', ' +
          $scope.sales.customer.billing_address.barangay + ', ' +
          $scope.sales.customer.billing_address.city + ', ' +
          $scope.sales.customer.billing_address.province + ', ' +
          $scope.sales.customer.billing_address.country + ', ' +
          $scope.sales.customer.billing_address.zipcode;
    }
  }
  $scope.addOrder = function(sales){
    var item = angular.copy(sales.item);
    if( item && item.name && item.quantity && item.quantity ){
      item.override = item.override ? item.override : "NORMAL";
      if(sales.customer.price_type == "Professional"){
        item.price = item.professional_price
      }
      if(sales.customer.price_type == "Retail"){
        item.price = item.retail_price;
      }
      if(item.override != "NORMAL"){
        item.price = item.override;
        item.total = 0.00;
      }
      if(!isNaN(item.price)){
        item.total = item.quantity * item.price;
      }
      delete item.inventories;
      if($scope.sales.ordered_items){
        $scope.sales.ordered_items.push(item);
      }
      else{
        $scope.sales.ordered_items = [item];
      }
      delete sales.item;
    }
    $scope.sales.subtotal = 0;
    $scope.sales.isNeedApproval = false;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
      if($scope.sales.ordered_items[i].override != "NORMAL"){
        $scope.sales.isNeedApproval = true;
      }
     }
     var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        $scope.sales.customer.discount.replace(" %","")/100,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
     );
     $scope.sales.discount = computation.totalDiscount;
     $scope.sales.total_vat = computation.vatableSales;
     $scope.sales.total_amount_due = computation.totalAmountDue;
     $scope.sales.zero_rate_sales = computation.zeroRatedSales;
     $scope.sales.withholding_tax = computation.withholdingTax;
  }

  $scope.reCompute = function(sales){
    if($scope.sales.customer){
      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        $scope.sales.customer.discount.replace(" %","")/100,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
      );
      $scope.sales.discount = computation.totalDiscount;
      $scope.sales.total_vat = computation.vatableSales;
      $scope.sales.total_amount_due = computation.totalAmountDue;
      $scope.sales.zero_rate_sales = computation.zeroRatedSales;
      $scope.sales.withholding_tax = computation.withholdingTax;
    }
  }
  $scope.removeOrder = function(index){
    $scope.sales.ordered_items.splice(index, 1);
    $scope.sales.subtotal = 0;
    $scope.sales.isNeedApproval = false;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
      if($scope.sales.ordered_items[i].override != "NORMAL"){
        $scope.sales.isNeedApproval = true;
      }
    }
  }
  if(action == 'read'){
    $scope.title = "VIEW SALES ORDER";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'add'){
    $scope.title = "ADD SALES ORDER";
    var Sales = Api.Collection('sales');
    $scope.sales = new Sales();

    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){

        $scope.sales.status = status.order.override;
        console.log($scope.sales);
      }
      else{
        $scope.sales.status = status.order.created;
    //    $scope.sales.triggerInventory  = "OUT";
      }
      $scope.sales.$save(function(){
        $location.path('/sales/index/order');
        return false;
      });
    }
  }
  if(action == 'edit'){

    $scope.title = "EDIT SALES ORDER "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.override;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };
    $scope.deleteSales=function(sales){
      if(popupService.showPopup('You are about to delete Record : '+sales._id)){
        $scope.sales.$delete(function(){
          $location.path('/sales/index/order');
          return false;
        });
      }
    };
  }
  if(action == 'approve'){

    $scope.title = "APPROVE SALES ORDER "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.created;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/override');
        return false;
      });
    };
    $scope.deleteSales=function(sales){
      if(popupService.showPopup('You are about to delete Record : '+sales._id)){
        $scope.sales.$delete(function(){
          $location.path('/sales/index/override');
          return false;
        });
      }
    };
  }

})
.controller('SalesProformaCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.products = Api.Collection('products').query();
  var status = Library.Status.Sales;

  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
          $scope.sales.customer.shipping_address.landmark + ', ' +
          $scope.sales.customer.shipping_address.barangay + ', ' +
          $scope.sales.customer.shipping_address.city + ', ' +
          $scope.sales.customer.shipping_address.province + ', ' +
          $scope.sales.customer.shipping_address.country + ', ' +
          $scope.sales.customer.shipping_address.zipcode;
      $scope.billing_address =
          $scope.sales.customer.billing_address.landmark + ', ' +
          $scope.sales.customer.billing_address.barangay + ', ' +
          $scope.sales.customer.billing_address.city + ', ' +
          $scope.sales.customer.billing_address.province + ', ' +
          $scope.sales.customer.billing_address.country + ', ' +
          $scope.sales.customer.billing_address.zipcode;
    }
  }
  $scope.addOrder = function(sales){
    console.log("passed addOrder");
    var item = angular.copy(sales.item);
    if( item && item.name && item.quantity && item.quantity ){
      item.override = item.override ? item.override : "NORMAL";
      if(sales.customer.price_type == "Professional"){
        item.price = item.professional_price
      }
      if(sales.customer.price_type == "Retail"){
        item.price = item.retail_price;
      }
      if(item.override != "NORMAL"){
        item.price = item.override;
        item.total = 0.00;
      }
      if(!isNaN(item.price)){
        item.total = item.quantity * item.price;
      }
      delete item.inventories;
      if($scope.sales.ordered_items){
        $scope.sales.ordered_items.push(item);
      }
      else{
        $scope.sales.ordered_items = [item];
      }
      delete sales.item;
    }
    $scope.sales.subtotal = 0;
    $scope.sales.isNeedApproval = false;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
      if($scope.sales.ordered_items[i].override != "NORMAL"){
        $scope.sales.isNeedApproval = true;
      }
    }
     var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        $scope.sales.customer.discount.replace(" %","")/100,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
     );
     console.log("passed add Computation");
     $scope.sales.discount = computation.totalDiscount;
     $scope.sales.total_vat = computation.vatableSales;
     $scope.sales.total_amount_due = computation.totalAmountDue;
     $scope.sales.zero_rate_sales = computation.zeroRatedSales;
     $scope.sales.withholding_tax = computation.withholdingTax;
  }

  $scope.reCompute = function(sales){
    console.log("passed re Compute");
    if($scope.sales.customer){
      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        $scope.sales.customer.discount.replace(" %","")/100,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
      );
      $scope.sales.discount = computation.totalDiscount;
      $scope.sales.total_vat = computation.vatableSales;
      $scope.sales.total_amount_due = computation.totalAmountDue;
      $scope.sales.zero_rate_sales = computation.zeroRatedSales;
      $scope.sales.withholding_tax = computation.withholdingTax;
    }
  }
  $scope.removeOrder = function(index){
    console.log("passed remove Order");
    $scope.sales.ordered_items.splice(index, 1);
    $scope.sales.subtotal = 0;
    $scope.sales.isNeedApproval = false;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
      if($scope.sales.ordered_items[i].override != "NORMAL"){
        $scope.sales.isNeedApproval = true;
      }
    }
  }
  if(action == 'read'){
    console.log("passed proforma read");
    $scope.title = "VIEW PROFORMA INVOICE";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'add'){
    console.log("passed proforma invoice");
    $scope.title = "ADD PROFORMA INVOICE";
    var Sales = Api.Collection('sales');
    $scope.sales = new Sales();

    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){

        $scope.sales.status = status.proforma.override;
        console.log($scope.sales);
      }
      else{
        $scope.sales.status = status.proforma.created;
      //  $scope.sales.triggerInventory  = "OUT";
      }
      $scope.sales.$save(function(){
        $location.path('/sales/index/proforma');
        return false;
      });
    }
  }
  if(action == 'edit'){

    $scope.title = "EDIT PROFORMA INVOICE"+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.override;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/proforma');
        return false;
      });
    };
    $scope.deleteSales=function(sales){
      if(popupService.showPopup('You are about to delete Record : '+sales._id)){
        $scope.sales.$delete(function(){
          $location.path('/sales/index/proforma');
          return false;
        });
      }
    };
  }
  if(action == 'approve'){

    $scope.title = "APPROVE PROFORMA INVOICE"+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.created;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/override');
        return false;
      });
    };
    $scope.deleteSales=function(sales){
      if(popupService.showPopup('You are about to delete Record : '+sales._id)){
        $scope.sales.$delete(function(){
          $location.path('/sales/index/override');
          return false;
        });
      }
    };
  }

})
.controller('PackingCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  $scope.ajax_ready = false;
  Structure.Packing.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.init = function(){
      columns = [
      $scope.structure.pckno, $scope.structure.inventory_location, $scope.structure.delivery_date, $scope.structure.prepared_by,
      $scope.structure.preparation_date
      ];

      buttons = [
      {url:"/#/packing/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/packing/edit/",title:"Edit Record",icon:"fa fa-edit"}
      ];
      $scope.title = "PACKING"
      $scope.addUrl = "/#/packing/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/packing");
    };
    $scope.formInit = function(){

      var id = $routeParams.id;
      var action = $routeParams.action;
      var status = Library.Status.Sales;
      $scope.inventory_locations = Api.Collection('customers',query).query();
      $scope.ListChange = function(){
          console.log($scope.packing.inventory_location,$scope.packing.delivery_date);
          $scope.packing.list = [];
          if($scope.packing.inventory_location){
            var query = {"inventory_location":$scope.packing.inventory_location};

            Api.Collection('sales',query).query().$promise.then(function(data){
              console.log(data);
              for(var i in data){
                for(var j in data[i].ordered_items){
                  var item = {
                    id : data[i]._id,
                    pfno : data[i].pfno,
                    sono : data[i].sono,
                    customer : data[i].customer.company_name,
                    brand : data[i].ordered_items[j].brand,
                    product : data[i].ordered_items[j].name,
                    quantity : data[i].ordered_items[j].quantity,
                  };
                  $scope.packing.list.push(item);
                }
              }

            });


          }
      };

      $scope.action = action;
      if(id && action == 'read'){
        $scope.title = "VIEW PACKING " + id;
        $scope.packing =  Api.Collection('packing').get({id:$routeParams.id});
      }
      if(id && action == 'edit'){
        $scope.title = "EDIT PACKING " + id;
        $scope.packing =  Api.Collection('packing').get({id:$routeParams.id});

        $scope.deletePacking=function(packing){
          if(popupService.showPopup('You are about to delete Record : '+packing._id)){
            $scope.packing.$delete(function(){
              $location.path('/packing/index');
              return false;
            });
          }
        };
      }
      if(action == 'add'){
        $scope.title = "ADD PACKING";
        var Packing = Api.Collection('packing');
        $scope.packing = new Packing();
        $scope.savePacking = function(){
          $scope.packing.status = status.packing.created;
          $scope.packing.$save(function(){
            var sono = [];
            async.each($scope.packing.list, function( item, callback) {
              if(sono.indexOf(item.sono) == -1){
                sono.push(item.sono);
                Api.Collection('sales').get({id : item.id}).$promise.then(function(sales){
                  sales.status = status.packing.created;
                  sales.pckno =  $scope.packing.pckno;
                  sales.$update(function(){
                    callback();
                  });
                });
              }
              else{
                callback();
              }
            },function(err){
              if(err){
                console.log(err);
              }
            });

            $location.path('/packing/index');
            return false;
          });
        }
      }
    }
  });
})
.controller('DeliveryReceiptCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.products = Api.Collection('products').query();
  var status = Library.Status.Sales;

  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
      $scope.sales.customer.shipping_address.landmark + ', ' +
      $scope.sales.customer.shipping_address.barangay + ', ' +
      $scope.sales.customer.shipping_address.city + ', ' +
      $scope.sales.customer.shipping_address.province + ', ' +
      $scope.sales.customer.shipping_address.country + ', ' +
      $scope.sales.customer.shipping_address.zipcode;

      $scope.billing_address =
      $scope.sales.customer.billing_address.landmark + ', ' +
      $scope.sales.customer.billing_address.barangay + ', ' +
      $scope.sales.customer.billing_address.city + ', ' +
      $scope.sales.customer.billing_address.province + ', ' +
      $scope.sales.customer.billing_address.country + ', ' +
      $scope.sales.customer.billing_address.zipcode;
    }
  }
  if(action == 'read'){
    $scope.title = "VIEW DELIVERY RECEIPT";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'approve'){

    $scope.title = "APPROVE DELIVERY RECEIPT "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.delivery.approved;
      $scope.sales.$update(function(){
        $location.path('/sales/index/delivery');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.delivery.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/delivery');
        return false;
      });
    };
  }
})
.controller('SalesInvoiceCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.products = Api.Collection('products').query();
  var status = Library.Status.Sales;

  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
      $scope.sales.customer.shipping_address.landmark + ', ' +
      $scope.sales.customer.shipping_address.barangay + ', ' +
      $scope.sales.customer.shipping_address.city + ', ' +
      $scope.sales.customer.shipping_address.province + ', ' +
      $scope.sales.customer.shipping_address.country + ', ' +
      $scope.sales.customer.shipping_address.zipcode;

      $scope.billing_address =
      $scope.sales.customer.billing_address.landmark + ', ' +
      $scope.sales.customer.billing_address.barangay + ', ' +
      $scope.sales.customer.billing_address.city + ', ' +
      $scope.sales.customer.billing_address.province + ', ' +
      $scope.sales.customer.billing_address.country + ', ' +
      $scope.sales.customer.billing_address.zipcode;
    }
  }
  if(action == 'read'){
    $scope.title = "VIEW SALES INVOICE";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'approve'){

    $scope.title = "APPROVE SALES INVOICE "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.invoice.approved;
      $scope.sales.$update(function(){
        $location.path('/sales/index/invoice');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.invoice.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/invoice');
        return false;
      });
    };
  }
})
.controller('SalesPaymentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.sales_executives = Api.Collection('sales_executives').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  $scope.shipping_modes = Api.Collection('shipping_modes').query();
  $scope.inventory_locations = Api.Collection('inventory_locations').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.products = Api.Collection('products').query();
  var status = Library.Status.Sales;

  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
      $scope.sales.customer.shipping_address.landmark + ', ' +
      $scope.sales.customer.shipping_address.barangay + ', ' +
      $scope.sales.customer.shipping_address.city + ', ' +
      $scope.sales.customer.shipping_address.province + ', ' +
      $scope.sales.customer.shipping_address.country + ', ' +
      $scope.sales.customer.shipping_address.zipcode;

      $scope.billing_address =
      $scope.sales.customer.billing_address.landmark + ', ' +
      $scope.sales.customer.billing_address.barangay + ', ' +
      $scope.sales.customer.billing_address.city + ', ' +
      $scope.sales.customer.billing_address.province + ', ' +
      $scope.sales.customer.billing_address.country + ', ' +
      $scope.sales.customer.billing_address.zipcode;
    }
  }
  if(action == 'read'){
    $scope.title = "VIEW SALES PAYMENT";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'approve'){
    $scope.title = "APPROVE PAYMENT "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.payment.confirmed;
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };


    $scope.addOrder = function(sales){
      var item = angular.copy(sales.item);
      if( item && item.name && item.quantity && item.quantity ){
        item.override = item.override ? item.override : "NORMAL";
        if(sales.customer.price_type == "Professional"){
          item.price = item.professional_price
        }
        if(sales.customer.price_type == "Retail"){
          item.price = item.retail_price;
        }
        if(item.override != "NORMAL"){
          item.price = item.override;
          item.total = 0.00;
        }
        if(!isNaN(item.price)){
          item.total = item.quantity * item.price;
        }
        delete item.inventories;
        if($scope.sales.ordered_items){
          $scope.sales.ordered_items.push(item);
        }
        else{
          $scope.sales.ordered_items = [item];
        }
        delete sales.item;
      }
      $scope.sales.subtotal = 0;
      $scope.sales.isNeedApproval = false;
      for(var i=0;i<$scope.sales.ordered_items.length; i++){
        $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
        if($scope.sales.ordered_items[i].override != "NORMAL"){
          $scope.sales.isNeedApproval = true;
        }
      }
       var computation = Library.Compute.Order(
          $scope.sales.subtotal,
          $scope.sales.customer.discount.replace(" %","")/100,
          $scope.sales.isWithholdingTax,
          $scope.sales.isZeroRateSales
       );
       $scope.sales.discount = computation.totalDiscount;
       $scope.sales.total_vat = computation.vatableSales;
       $scope.sales.total_amount_due = computation.totalAmountDue;
       $scope.sales.zero_rate_sales = computation.zeroRatedSales;
       $scope.sales.withholding_tax = computation.withholdingTax;
    }

    $scope.reCompute = function(sales){
      if($scope.sales.customer){
        var computation = Library.Compute.Order(
          $scope.sales.subtotal,
          $scope.sales.customer.discount.replace(" %","")/100,
          $scope.sales.isWithholdingTax,
          $scope.sales.isZeroRateSales
        );
        $scope.sales.discount = computation.totalDiscount;
        $scope.sales.total_vat = computation.vatableSales;
        $scope.sales.total_amount_due = computation.totalAmountDue;
        $scope.sales.zero_rate_sales = computation.zeroRatedSales;
        $scope.sales.withholding_tax = computation.withholdingTax;
      }
    }
    $scope.removeOrder = function(index){
      $scope.sales.ordered_items.splice(index, 1);
      $scope.sales.subtotal = 0;
      $scope.sales.isNeedApproval = false;
      for(var i=0;i<$scope.sales.ordered_items.length; i++){
        $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
        if($scope.sales.ordered_items[i].override != "NORMAL"){
          $scope.sales.isNeedApproval = true;
        }
      }
    }
  }
})
.controller('SalesReturnCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.transaction_types = Api.Collection('transaction_types').query();
  $scope.customers = Api.Collection('customers').query();
  $scope.price_types = Api.Collection('price_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
    $scope.CustomerChange();
    $scope.products = angular.copy($scope.sales.ordered_items);
  });
  var status = Library.Status.Sales;

  $scope.addReturn = function(sales){
    var item = angular.copy(sales.return);
    if( item && item.name && item.quantity && item.quantity ){
      $scope.sales.returned_items
    }
    if($scope.sales.returned_items){
      $$scope.sales.returned_items.push(item);
    }
    else{
      $scope.sales.returned_items = [item];
    }
    delete sales.return;
    $scope.sales.rsubtotal = 0;
    $scope.sales.isNeedApproval = false;
    for(var i=0;i<$scope.sales.returned_items.length; i++){
      $scope.sales.rsubtotal+=$scope.sales.returned_items[i].total;
      if($scope.sales.returned_items[i].override != "NORMAL"){
        $scope.sales.isNeedApproval = true;
      }
    }
    var computation = Library.Compute.Order(
      $scope.sales.subtotal,
      $scope.sales.returnsubtotal,
      $scope.sales.customer.discount.replace(" %","")/100,
      $scope.sales.isWithholdingTax,
      $scope.sales.isZeroRateSales
    );
    $scope.sales.discount = computation.totalDiscount;
    $scope.sales.total_vat = computation.vatableSales;
    $scope.sales.return_discount = computation.totalDiscount;
    $scope.sales.return_total_vat = computation.vatableSales;
    $scope.sales.total_amount_due = computation.totalAmountDue;
    $scope.sales.zero_rate_sales = computation.zeroRatedSales;
    $scope.sales.withholding_tax = computation.withholdingTax;
  }
  $scope.removeReturn = function(index){
    $scope.sales.returned_items.splice(index, 1);
  }
  $scope.CustomerChange = function(){
    if($scope.sales.customer){
      $scope.shipping_address =
      $scope.sales.customer.shipping_address.landmark + ', ' +
      $scope.sales.customer.shipping_address.barangay + ', ' +
      $scope.sales.customer.shipping_address.city + ', ' +
      $scope.sales.customer.shipping_address.province + ', ' +
      $scope.sales.customer.shipping_address.country + ', ' +
      $scope.sales.customer.shipping_address.zipcode;

      $scope.billing_address =
      $scope.sales.customer.billing_address.landmark + ', ' +
      $scope.sales.customer.billing_address.barangay + ', ' +
      $scope.sales.customer.billing_address.city + ', ' +
      $scope.sales.customer.billing_address.province + ', ' +
      $scope.sales.customer.billing_address.country + ', ' +
      $scope.sales.customer.billing_address.zipcode;
    }
  }
  if(action == 'read'){
    $scope.title = "VIEW RETURN MERCHANDISE RECEIPT";

  }
  if(action == 'approve'){

    $scope.title = "APPROVE RETURN MERCHANDISE RECEIPT"+ id;
    $scope.saveSales = function(){
      $scope.sales.status = status.returned.approved;
      $scope.sales.$update(function(){
        $location.path('/sales/index/return');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.returned.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/return');
        return false;
      });
    };
  }
});
