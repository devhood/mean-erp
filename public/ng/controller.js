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

            query = {"pfno": { "$exists": true }, "status.status_code" : {"$in" : [status.proforma.created.status_code, status.proforma.revised.status_code, status.payment.rejected.status_code]}};
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

            query = { "status.status_code" : {"$in" : [
                status.order.created.status_code,
                status.order.override.status_code,
                status.delivery.rejected.status_code,
                status.invoice.rejected.status_code,
                ]}};
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

          query = {"drno": { "$exists": true }, "status.status_code" : {"$in" : [status.delivery.approved.status_code, status.payment.rejected.status_code]}};
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
            {url:"/#/sales/return/create/",title:"Approve Record",icon:"fa fa-gear"}
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

          query = { "status.status_code" : {"$in" : [status.returned.created.status_code]}};
          $scope.title1 = "CREATED RETURN MERCHANDISE RECEIPT";

          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          break;
          case "approveReturn" :

            columns = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
            {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/return/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = { "status.status_code" : {"$in" : [status.returned.created.status_code]}};
            $scope.title = "RETURN MERCHANDISE RECEIPT";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

            var columns1 = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.rmrno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons1 = [
            {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"}
            ];

            query = { "status.status_code" : {"$in" : [status.returned.approved.status_code]}};
            $scope.title1 = "APPROVED RETURN MERCHANDISE RECEIPT";

            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          break;
          case "memo" :

            columns = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.rmrno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
            {url:"/#/sales/memo/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/memo/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = {"rmrno": { "$exists": true }, "status.status_code" : {"$in" : [status.returned.approved.status_code, status.payment.rejected.status_code]}};

            $scope.title = "CREDIT MEMO";
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

            var columns1 = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons1 = [
            {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"}
            ];

            query = { "status.status_code" : {"$in" : [status.memo.approved.status_code]}};
            $scope.title1 = "APPROVED CREDIT MEMO";

            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          break;
          case "payment" :
            columns = [
            $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
            {url:"/#/sales/payment/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/payment/approve/",title:"Approve Record",icon:"fa fa-gear"},
            {url:"/#/sales/payment/update/",title:"Update Record",icon:"fa fa-edit"}
            ];

            query = { "status.status_code" : {"$in" : [status.invoice.approved.status_code, status.proforma.created.status_code, status.memo.approved.status_code]}};
            $scope.title = "PAYMENT";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

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
        0,
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
        0,
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
      else{
        $scope.sales.status = status.order.created;
        //    $scope.sales.triggerInventory  = "OUT";
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
.controller('ShipmentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  $scope.ajax_ready = false;
  Structure.Shipments.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};


    $scope.init = function(){
      var type = $routeParams.type;
      var status = Library.Status.Shipments;
      switch(type){
        case "create" :
          columns = [
          $scope.structure.shipno, $scope.structure.supplier, $scope.structure.reference_number,
          $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
          ];

          buttons = [
          {url:"/#/shipment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/shipment/edit/",title:"Edit Record",icon:"fa fa-edit"}
          ];

          query = { "status.status_code" : {"$in" : [status.created.status_code]}};

          $scope.title = "NEW SHIPMENTS"
          $scope.addUrl = "/#/shipment/add"
          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));

          var columns1 = [
          $scope.structure.shipno, $scope.structure.supplier, $scope.structure.reference_number,
          $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
          ];

          var buttons1 = [
          {url:"/#/shipment/read/",title:"View Record",icon:"fa fa-folder-open"},
          ];

          query = { "status.status_code" : {"$in" : [status.approved.status_code]}};

          $scope.title1 = "SHIPMENTS FOR APPROVAL"
          $scope.addUrl = "/#/shipment/add"
          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "approve" :
          columns = [
          $scope.structure.shipno, $scope.structure.supplier, $scope.structure.reference_number,
          $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
          ];

          buttons = [
          {url:"/#/shipment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/shipment/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/shipment/approve/",title:"Approve Shipment",icon:"fa fa-gear"}
          ];

          var status = Library.Status.Shipments;
          query = { "status.status_code" : {"$in" : [status.created.status_code, status.approved.status_code]}};

          $scope.title = "SHIPMENTS FOR APPROVAL"
          $scope.addUrl = "/#/shipment/add"
          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
      }//end of switch
  };


    $scope.formInit = function(){
      console.log("form init passed");
      var id = $routeParams.id;
      var action = $routeParams.action;
      $scope.suppliers = Api.Collection('suppliers').query();
      $scope.products = Api.Collection('products').query();
      $scope.conditions = Api.Collection('conditions').query();
      var status = Library.Status.Shipments;



      $scope.action = action;
      if(action == 'add'){
        $scope.title = "ADD SHIPMENT";
        var Shipment = Api.Collection('shipments');
        $scope.shipment = new Shipment();
        $scope.shipment.status = status.created;
        $scope.saveShipment = function(){
          $scope.shipment.$save(function(){
            $location.path('/shipment/index/create');
            return false;
          });
        }
      }



      if(action == 'read'){
        console.log("reading");
        $scope.title = "VIEW SHIPMENT " + id;
        $scope.shipment =  Api.Collection('shipments').get({id:$routeParams.id},function(){
        });
      }

      if (action == 'edit') {
        console.log("editing");
        $scope.title = "EDIT SHIPMENT" + id;
        $scope.shipment =  Api.Collection('shipments').get({id:$routeParams.id},function(){
        });
        $scope.saveShipment = function(){
          $scope.shipment.status = status.updated;
          $scope.shipment.$update(function(){
            $location.path('/shipment/index/create');
            return false;
          });
        };
        $scope.deleteShipment=function(shipment){
          if(popupService.showPopup('You are about to delete Record : '+shipment._id)){
            $scope.shipment.$delete(function(){
              $location.path('/shipment/index/create');
              return false;
            });
          }
        };
      }



      if(action == 'approve'){
        $scope.title = "APPROVE SHIPMENT "+ id;
        $scope.shipment =  Api.Collection('shipments').get({id:$routeParams.id},function(){
        });
        $scope.saveShipment = function(){
          $scope.shipment.status = status.approved;
          $scope.shipment.$update(function(){
            $location.path('/shipment/index/approve');
            return false;
          });
        };
        $scope.deleteShipment=function(shipment){
          if(popupService.showPopup('You are about to delete Record : '+shipment._id)){
            $scope.shipment.$delete(function(){
              $location.path('/shipment/index/aprove');
              return false;
            });
          }
        };
      }

      $scope.addItem = function(item){
        var shipment_item = angular.copy(item);
        if(shipment_item){
          delete shipment_item.inventories;
        }
        console.log(shipment_item);
        if(shipment_item.name && shipment_item.quantity && shipment_item.cost && shipment_item.condition){
          if($scope.shipment.shipment_items){
            $scope.shipment.shipment_items.push(shipment_item);
          }
          else{
            $scope.shipment.shipment_items = [shipment_item];
          }
        }
      }
      $scope.removeItem = function(index){
        $scope.shipment.shipment_items.splice(index, 1);
      }
    }

  });

})
.controller('PurchaseCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

  $scope.ajax_ready = false;
  Structure.Purchases.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.init = function(){
      columns = [
      $scope.structure.purno, $scope.structure.supplier, $scope.structure.reference_number,
      $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
      ];

      buttons = [
      {url:"/#/purchase/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/purchase/edit/",title:"Edit Record",icon:"fa fa-edit"},
      {url:"/#/purchase/approve/",title:"Approve Purchase",icon:"fa fa-gear"}
      ];

      var status = Library.Status.Purchases;
      console.log(status);
      query = { "status.status_code" : {"$in" : [status.created.status_code, status.updated.status_code]}};

      $scope.title = "PURCHASE"
      $scope.addUrl = "/#/purchase/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/purchases?filter="+encodeURIComponent(JSON.stringify(query)));
    };


    $scope.formInit = function(){
      console.log("form init passed");
      var id = $routeParams.id;
      var action = $routeParams.action;
      $scope.suppliers = Api.Collection('suppliers').query();
      $scope.products = Api.Collection('products').query();
      $scope.conditions = Api.Collection('conditions').query();
      var status = Library.Status.Purchases;



      $scope.action = action;
      if(action == 'add'){
        $scope.title = "ADD PURCHASE";
        var Purchase = Api.Collection('purchases');
        $scope.purchase = new Purchase();
        $scope.purchase.status = status.created;
        $scope.savePurchase = function(){
          $scope.purchase.$save(function(){
            $location.path('/purchase/index');
            return false;
          });
        }
      }//end action add



      if(action == 'read'){
        console.log("reading");
        $scope.title = "VIEW PURCHASE " + id;
        $scope.purchase =  Api.Collection('purchases').get({id:$routeParams.id},function(){
        });
      }

      if (action == 'edit') {
        console.log("editing");
        $scope.title = "EDIT PURCHASE" + id;
        $scope.purchase =  Api.Collection('purchases').get({id:$routeParams.id},function(){
        });
        $scope.savePurchase = function(){
          $scope.purchase.status = status.updated;
          $scope.purchase.$update(function(){
            $location.path('/purchase/index/');
            return false;
          });
        };
        $scope.deletePurchase=function(purchase){
          if(popupService.showPopup('You are about to delete Record : '+purchase._id)){
            $scope.purchase.$delete(function(){
              $location.path('/purchase/index');
              return false;
            });
          }
        };
      }



      if(action == 'approve'){
        $scope.title = "APPROVE PURCHASE "+ id;
        $scope.purchase =  Api.Collection('purchases').get({id:$routeParams.id},function(){
        });
        $scope.savePurchase = function(){
          $scope.purchase.status = status.approved;
          $scope.purchase.$update(function(){
            $location.path('/purchase/index/');
            return false;
          });
        };
        $scope.deletePurchase=function(purchase){
          if(popupService.showPopup('You are about to delete Record : '+purchase._id)){
            $scope.purchase.$delete(function(){
              $location.path('/purchase/index');
              return false;
            });
          }
        };
      } //end action approve

      $scope.addItem = function(item){
        var purchase_item = angular.copy(item);
        delete purchase_item.inventories;
        if(purchase_item.name && purchase_item.quantity && purchase_item.cost){
          if($scope.purchase.purchase_items){
            $scope.purchase.purchase_items.push(purchase_item);
          }
          else{
            $scope.purchase.purchase_items = [purchase_item];
          }
        }
      }
      $scope.removeItem = function(index){
        $scope.purchase.purchase_items.splice(index, 1);
      }
    }

  });

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
      $scope.structure.pckno, $scope.structure.prepared_by
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
          $scope.packing.list = [];
          if($scope.packing.inventory_location){
            var query = {
              "inventory_location":$scope.packing.inventory_location,
              "status.status_code" : {"$in" : [status.order.created.status_code,status.order.revised.status_code]}
            };

            Api.Collection('sales',query).query().$promise.then(function(data){
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
        $scope.removeItem = function(index){
          $scope.packing.list.splice(index, 1);
        };
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
  $scope.payment_types = Api.Collection('payment_types').query();
  $scope.discounts = Api.Collection('discounts').query();
  $scope.payment_terms = Api.Collection('payment_terms').query();
  $scope.order_sources = Api.Collection('order_sources').query();
  $scope.delivery_methods = Api.Collection('delivery_methods').query();
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

  var PrintTotalPayment = function() {
    $scope.sales.total_payment = 0;
    console.log("chito",$scope.sales.payment_details);
    if($scope.sales.payment_details){
      for(var i=0;i<$scope.sales.payment_details.length; i++){
        $scope.sales.total_payment+=$scope.sales.payment_details[i].amount;
      }
    }
  }


  $scope.addPayment = function(payment_detail){
    var payment = angular.copy(payment_detail);
    if(payment.payment_type && payment.check_number && payment.check_dep_date && payment.bank && payment.amount){
        if($scope.sales.payment_details){
          $scope.sales.payment_details.push(payment);
        }
        else{
          $scope.sales.payment_details = [payment];
        }
    }
    payment_detail = {};
    payment = {};
    PrintTotalPayment();
  }

  $scope.removePayment = function(index){
    $scope.sales.payment_details.splice(index, 1);
    PrintTotalPayment();
  }


  if(action == 'read'){
    $scope.title = "VIEW SALES PAYMENT";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id});
  }

  if(action == 'update'){
    $scope.title = "UPDATE SALES PAYMENT"+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      PrintTotalPayment();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.payment.confirmed;
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };

    $scope.rejectSales = function(){
      $scope.sales.status = status.payment.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };
  }

  if(action == 'approve'){

    $scope.title = "APPROVE SALES PAYMENT "+ id;
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
    item.total = item.price * item.quantity ;
    if( item && item.name && item.quantity && item.quantity ){
      $scope.sales.returned_items
    }
    if($scope.sales.returned_items){
      $scope.sales.returned_items.push(item);
    }
    else{
      $scope.sales.returned_items = [item];
    }
    delete sales.return;
    $scope.sales.returnsubtotal = 0;
    $scope.sales.subtotal = 0;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
    }
    for(var i=0;i<$scope.sales.returned_items.length; i++){
      $scope.sales.returnsubtotal+=$scope.sales.returned_items[i].total;
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
    $scope.sales.total_amount_due = computation.totalAmountDue;
    $scope.sales.zero_rate_sales = computation.zeroRatedSales;
    $scope.sales.withholding_tax = computation.withholdingTax;
  }
  $scope.removeReturn = function(index){
    $scope.sales.returned_items.splice(index, 1);
    $scope.sales.returnsubtotal = 0;
    $scope.sales.subtotal = 0;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
      $scope.sales.subtotal+=$scope.sales.ordered_items[i].total;
    }
    for(var i=0;i<$scope.sales.returned_items.length; i++){
      $scope.sales.returnsubtotal+=$scope.sales.returned_items[i].total;
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
    $scope.sales.total_amount_due = computation.totalAmountDue;
    $scope.sales.zero_rate_sales = computation.zeroRatedSales;
    $scope.sales.withholding_tax = computation.withholdingTax;
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
  if(action == 'create'){

    $scope.title = "CREATE RETURN MERCHANDISE RECEIPT"+ id;
    $scope.saveSales = function(){
      $scope.sales.status = status.returned.created;
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
  if(action == 'approve'){

    $scope.title = "CREATE RETURN MERCHANDISE RECEIPT"+ id;
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
})
.controller('SalesMemoCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
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
    $scope.title = "VIEW CREDIT MEMO";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'approve'){

    $scope.title = "APPROVE CREDIT MEMO "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.memo.approved;
      $scope.sales.$update(function(){
        $location.path('/sales/index/memo');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.memo.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/memo');
        return false;
      });
    };
  }
})
.controller('ConsignmentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {
  $scope.ajax_ready = false;
  Structure.Consignments.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
    $scope.consignment_transaction_types = Api.Collection('consignment_transaction_type').query();
    $scope.price_types = Api.Collection('price_types').query();
    $scope.order_sources = Api.Collection('order_sources').query();
    $scope.delivery_methods = Api.Collection('delivery_methods').query();
    var query = {"type":"Retail"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var status = Library.Status.Consignment;


    $scope.init = function(){
         columns = [
          $scope.structure.cono,$scope.structure.consignment_transaction_type,
          $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
          ];

        buttons = [
          {url:"/#/consignment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/consignment/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/consignment/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];

        query = { "status.status_code" : {"$in" : [status.created.status_code,status.override.status_code]}};
        $scope.title = "CONSIGNMENTS";
        $scope.addUrl = "/#/consignment/add";
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));
    }


    $scope.CustomerChange = function(){
      if($scope.consignments.customer){
        $scope.shipping_address =
        $scope.consignments.customer.shipping_address.landmark + ', ' +
        $scope.consignments.customer.shipping_address.barangay + ', ' +
        $scope.consignments.customer.shipping_address.city + ', ' +
        $scope.consignments.customer.shipping_address.province + ', ' +
        $scope.consignments.customer.shipping_address.country + ', ' +
        $scope.consignments.customer.shipping_address.zipcode;
        $scope.billing_address =
        $scope.consignments.customer.billing_address.landmark + ', ' +
        $scope.consignments.customer.billing_address.barangay + ', ' +
        $scope.consignments.customer.billing_address.city + ', ' +
        $scope.consignments.customer.billing_address.province + ', ' +
        $scope.consignments.customer.billing_address.country + ', ' +
        $scope.consignments.customer.billing_address.zipcode;
      }
    }
    $scope.addOrder = function(consignments){
      var item = angular.copy(consignments.item);
      if( item && item.name && item.quantity && item.quantity ){
        item.override = item.override ? item.override : "NORMAL";
        if(consignments.customer.price_type == "Professional"){
          item.price = item.professional_price
        }
        if(consignments.customer.price_type == "Retail"){
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
        if($scope.consignments.consigned_item){
          $scope.consignments.consigned_item.push(item);
        }
        else{
          $scope.consignments.consigned_item = [item];
        }
        delete consignments.item;
      }
      $scope.consignments.subtotal = 0;
      $scope.consignments.isNeedApproval = false;
      for(var i=0;i<$scope.consignments.consigned_item.length; i++){
        $scope.consignments.subtotal+=$scope.consignments.consigned_item[i].total;
        if($scope.consignments.consigned_item[i].override != "NORMAL"){
          $scope.consignments.isNeedApproval = true;
        }
      }

      var computation = Library.Compute.Order(

        $scope.consignments.subtotal,
        0,
        $scope.consignments.customer.discount.replace(" %","")/100,
        $scope.consignments.isWithholdingTax,
        $scope.consignments.isZeroRateSales
      );
      $scope.consignments.discount = computation.totalDiscount;
      $scope.consignments.total_vat = computation.vatableSales;
      $scope.consignments.total_amount_due = computation.totalAmountDue;
      $scope.consignments.zero_rate_sales = computation.zeroRatedSales;
      $scope.consignments.withholding_tax = computation.withholdingTax;

    }

    $scope.reCompute = function(consignments){
     // console.log($scope.consignments.customer);
      if($scope.consignments.customer){
        var computation = Library.Compute.Order(
          $scope.consignments.subtotal,
          0,
          $scope.consignments.customer.discount.replace(" %","")/100,
          $scope.consignments.isWithholdingTax,
          $scope.consignments.isZeroRateSales
        );
        $scope.consignments.discount = computation.totalDiscount;
        $scope.consignments.total_vat = computation.vatableSales;
        $scope.consignments.total_amount_due = computation.totalAmountDue;
        $scope.consignments.zero_rate_sales = computation.zeroRatedSales;
        $scope.consignments.withholding_tax = computation.withholdingTax;
      }
    }
    $scope.removeOrder = function(index){
      $scope.consignments.consigned_item.splice(index, 1);
      $scope.consignments.subtotal = 0;
      $scope.consignments.isNeedApproval = false;
      for(var i=0;i<$scope.consignments.consigned_item.length; i++){
        $scope.consignments.subtotal+=$scope.consignments.consigned_item[i].total;
        if($scope.consignments.consigned_item[i].override != "NORMAL"){
          $scope.consignments.isNeedApproval = true;
        }
      }
    }

    if( action == 'read'){
      $scope.title = "VIEW CONSIGN ORDER";
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
      });
    }
    if(action == 'add'){
      $scope.title = "ADD CONSIGN ORDER";
      var Consignments = Api.Collection('consignments');
      $scope.consignments = new Consignments();

      $scope.saveConsignments = function(){

        if($scope.consignments.isNeedApproval){

          $scope.consignments.status = status.override;
          console.log($scope.consignments);
        }
        else{
          $scope.consignments.status = status.created;
          //    $scope.sales.triggerInventory  = "OUT";
        }
        $scope.consignments.$save(function(){
          $location.path('/consignment/index/');
          return false;
        });
      }
    }
    if( id && action == 'edit'){

      $scope.title = "EDIT CONSIGNED ORDER "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveConsignments = function(){
        if($scope.consignments.isNeedApproval){
          $scope.consignments.status = status.override;
        }
        $scope.consignments.$update(function(){
          $location.path('/consignment/index/');
          return false;
        });
      };
      $scope.deleteConsignments=function(consignments){
        if(popupService.showPopup('You are about to delete Record : '+consignments._id)){
          $scope.consignments.$delete(function(){
            $location.path('/consignment/index/');
            return false;
          });
        }
      };
    }
    if(id && action == 'approve'){
      console.log('approved');
      $scope.title = "APPROVE CONSIGNED ORDER "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveConsignments = function(){
        if($scope.consignments.isNeedApproval){
          $scope.consignments.status = status.approved;
        }
        $scope.consignments.$update(function(){
          $location.path('/consignment/index/');
          return false;
        });
      };
      $scope.deleteConsignments=function(consignments){
        console.log('for Delete');

        if(popupService.showPopup('You are about to delete Record : '+consignments._id)){
          $scope.consignments.$delete(function(){
            $location.path('/consignment/index/override');
            return false;
          });
        }
    }
      };


    });
})
.controller('AdjustmentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Api, popupService) {

    $scope.ajax_ready = false;
  Structure.Adjustments.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
   // $scope.price_types = Api.Collection('price_types').query();
    $scope.transaction_types = Api.Collection('transaction_type').query();
    var query = {"type":"Retail"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var status = Library.Status.Adjustment;

    $scope.init = function(){

        columns = [

         $scope.structure.adjno,$scope.structure.transaction_type,$scope.structure.inventory_location,$scope.structure.status.status_name
          ];

        buttons = [
          {url:"/#/adjustment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/adjustment/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/adjustment/approve/",title:"Approve Record",icon:"fa fa-gear"}
        ];
        query = { "status.status_code" : {"$in" : [status.created.status_code]}};
        $scope.title = "ADJUSTMENT"
        $scope.addUrl = "/#/adjustment/add"
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/adjustments?filter="+encodeURIComponent(JSON.stringify(query)));
  }
    $scope.addOrder = function(adjustments){
      var item = angular.copy(adjustments.item);
      if( item && item.name && item.quantity && item.quantity ){
        delete item.inventories;
        if($scope.adjustments.adjusted_item){
          $scope.adjustments.adjusted_item.push(item);
        }
        else{
          $scope.adjustments.adjusted_item = [item];
        }
        delete adjustments.item;
      }
    }
    $scope.removeOrder = function(index){
      $scope.adjustments.adjusted_item.splice(index, 1);
      $scope.adjustments.subtotal = 0;
      $scope.adjustments.isNeedApproval = false;
      for(var i=0;i<$scope.adjustments.adjusted_item.length; i++){
        $scope.adjustments.subtotal+=$scope.adjustments.adjusted_item[i].total;
        if($scope.adjustments.adjusted_item[i].override != "NORMAL"){
          $scope.adjustments.isNeedApproval = true;
        }
      }
    }
    $scope.deleteAdjustments=function(adjustments){
        if(popupService.showPopup('You are about to delete Record : '+adjustments._id)){
          $scope.adjustments.$delete(function(){
            $location.path('/adjustment/index');
            return false;
          });
        }
      };
        if( action == 'read'){
      $scope.title = "VIEW ADJUSTMENT ORDER";
      $scope.adjustments =  Api.Collection('adjustments').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
      });
    }
    if(action == 'add'){
      $scope.title = "ADD ADJUSTMENT ORDER";
      var Adjustments = Api.Collection('adjustments');
      $scope.adjustments = new Adjustments();

      $scope.saveAdjustments = function(){

        if($scope.adjustments.isNeedApproval){

          $scope.adjustments.status = status.override;
          console.log($scope.adjustments);
        }
        else{
          $scope.adjustments.status = status.created;
          //    $scope.sales.triggerInventory  = "OUT";
        }
        $scope.adjustments.$save(function(){
          $location.path('/adjustment/index/');
          return false;
        });
      }
    }

    if( id && action == 'edit'){
      $scope.title = "EDIT ADJUSTMENT ORDER "+ id;
      $scope.adjustments =  Api.Collection('adjustments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveAdjustments = function(){
        if($scope.adjustments.isNeedApproval){
          $scope.adjustments.status = status.override;
        }
        $scope.consignments.$update(function(){
          $location.path('/adjustment/index/add');
          return false;
        });
      };
      $scope.deleteAdjustments=function(adjustments){
        if(popupService.showPopup('You are about to delete Record : '+adjustments._id)){
          $scope.adjustments.$delete(function(){
            $location.path('/adjustment/index/add');
            return false;
          });
        }
      };
    }
    if(id && action == 'approve'){

      $scope.title = "APPROVE ADJUSTMENT ORDER "+ id;
      $scope.adjustments =  Api.Collection('adjustments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveAdjustments = function(){
        if($scope.adjustments.isNeedApproval){
          $scope.adjustments.status = status.approved;
        }
        $scope.adjustments.$update(function(){
          $location.path('/adjustment/index/');
          return false;
        });
      };

    }

});
});
