'use strict';

angular.module('erp')
.controller('MainCtrl', function ($scope, $window, $filter, $routeParams, $location, Structure, Library, Session, Api, Reference) {
  Reference.Menu.query().$promise.then(function(data){
    Session.get(function(client) {
      $scope.client = client;
      var menu = [];
      for(var i in data){
        for(var j in data[i].childLink){
          for(var k in client.permissions){
            if(data[i].childLink[j].href.indexOf(client.permissions[k].route) != -1){
              data[i].childLink[j].show = true;
            }
          }
        }
      }
      $scope.menus = data;
      switch(client.position){
        case "President/CEO" :
          break;
        case "HR Manager" :
          break;
        case "Accounting Manager" :
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var columns = [];
            var buttons = [];
            var query = {};

            //dash-invoice
            columns = [
            $scope.structure.pfno,$scope.structure.sono,$scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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

            //dash-payment
            var columns1 = [
            $scope.structure.pfno, $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.delivery_date, $scope.structure.customer.payment_term,$scope.structure.total_amount_due, $scope.structure.status.status_name
            ];

            var buttons1 = [
            {url:"/#/sales/payment/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/payment/create/",title:"Create Payment Record",icon:"fa fa-save", state:{statusArray:["TRIP_TICKET_DELIVERED","TRIP_TICKET_CREATED", "PROFORMA_INVOICE_CREATED","MEMO_APPROVED"]}},
            {url:"/#/sales/payment/update/",title:"Update Record",icon:"fa fa-edit", state:{statusArray:["PAYMENT_CREATED", "PAYMENT_PARTIALED", "TRIP_TICKET_DELIVERED"]}},
            {url:"/#/sales/payment/approve/",title:"Approve Record",icon:"fa fa-gear", state:{statusArray:["PAYMENT_UPDATED"]}},
            ];

            query = { "status.status_code" : {"$in" : [status.invoice.approved.status_code, status.proforma.created.status_code,
            status.memo.approved.status_code, status.payment.updated.status_code,
            status.payment.created.status_code, status.tripticket.delivered.status_code,
            status.tripticket.created.status_code,
            status.proforma.approved.status_code, status.proforma.revised.status_code,
            status.payment.partialed.status_code, status.payment.rejected.status_code
            ]}};
            $scope.title1 = "PAYMENT";

            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

            //dash-memo
            var columns2 = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.rmrno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons2 = [
            {url:"/#/sales/memo/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/memo/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = {"rmrno": { "$exists": true }, "status.status_code" : {"$in" : [status.returned.approved.status_code, status.payment.rejected.status_code]}};
            $scope.title2 = "CREDIT MEMO";
            $scope.dtColumns2 = Library.DataTable.columns(columns2,buttons2);
            $scope.dtOptions2 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });

          //dash-shipments
          Structure.Shipments.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Shipments;
            var query = {};

            var columns3 = [
            $scope.structure.shipno, $scope.structure.supplier, $scope.structure.reference_number,
            $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
            ];

            var buttons3 = [
            {url:"/#/shipment/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/shipment/approve/",title:"Approve Shipment",icon:"fa fa-gear"}
            ];

            query = { "status.status_code" : {"$in" : [status.created.status_code, status.updated.status_code]}};

            $scope.title3 = "SHIPMENTS FOR APPROVAL"
            $scope.dtColumns3 = Library.DataTable.columns(columns3,buttons3);
            $scope.dtOptions3 = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));
          });

          break;
        case "Accounting Staff" :
          //dash-invoice
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var columns = [];
            var buttons = [];
            var query = {};

            columns = [
            $scope.structure.pfno,$scope.structure.sono,$scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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
          });
          break;
        case "Warehouse Manager" :
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var query = {};

            //dash-delivery
            var columns = [
            $scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = { "status.status_code" : {"$in" : [status.packing.created.status_code]}};
            $scope.title = "DELIVERY RECEIPTS";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));


            //dash-approveReturn
            var columns1 = [
            $scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons1 = [
            {url:"/#/sales/return/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/return/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = { "status.status_code" : {"$in" : [status.returned.created.status_code, status.returned.revised.status_code]}};
            $scope.title1 = "RETURN MERCHANDISE RECEIPT";

            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });

          //dash-consignmentdelivery
          $scope.ajax_ready = false;
          Structure.Consignments.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Consignments;
            var query = {};

            var columns2 = [
            $scope.structure.cono,$scope.structure.consignment_transaction_type,
            $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
            ];
            var buttons2 = [
            {url:"/#/consignment/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/consignment/delivery/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];
            query = { "status.status_code" : {"$in" : [
            status.packing.created.status_code,
            ]}};
            $scope.title2 = "CONSIGNMENT ORDERS FOR APPROVAL"

            $scope.dtColumns2 = Library.DataTable.columns(columns2,buttons2);
            $scope.dtOptions2 = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));
          });
          break;
        case "Warehouse Supervisor" :
          //approve delivery
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var query = {};

            //dash-delivery
            var columns = [
            $scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/delivery/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];

            query = { "status.status_code" : {"$in" : [status.packing.created.status_code]}};
            $scope.title = "DELIVERY RECEIPTS";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });
          break;
        case "Warehouse Staff" :
          //packing
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var query = {};

            var columns = [
            $scope.structure.customer.company_name, $scope.structure.delivery_date, $scope.structure.prepared_by, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/packing/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/packing/approve/",title:"View Record",icon:"fa fa-gear"}
            ];
            query = { "status.status_code" : {"$in" : [
            status.order.created.status_code,
            status.payment.partialed.status_code,
            status.order.revised.status_code,
            ]}};
            $scope.title = "SALES PACKING"
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

            //dash-delivery
            var columns1 = [
            $scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons1 = [
            {url:"/#/sales/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
            ];

            query = { "status.status_code" : {"$in" : [status.packing.created.status_code]}};
            $scope.title1 = "DELIVERY RECEIPTS";

            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });
          break;
          case "Sales Manager" :
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var query = {};

          //dash-sales override
            var columns = [
              $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/order/approve/",title:"Approve Record",icon:"fa fa-gear"},
            ];
            query = {"status.status_code" : {"$in" : [status.order.override.status_code]}};
            $scope.title = "APPROVE SALES ORDERS";
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

            //dash-proforma
            var columns1 = [
              $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];
            var buttons1 = [
            {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/proforma/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];
            query = {"status.status_code" : {"$in" : [status.proforma.override.status_code]}};
            $scope.title1 = "APPROVE PROFORMA INVOICE";
            $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
            $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));


          //dash-salesOrder
            var columns2 = [
            $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons2 = [
            {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/order/edit/",title:"Edit Record",icon:"fa fa-edit"},
            {url:"/#/sales/order/reschedule/",title:"Approve Record",icon:"fa fa-upload",exclude:{key:"trpno"}},
            {url:"/#/consignment/order/reschedule/",title:"Reschedule Record",icon:"fa fa-truck", state:{statusArray:["TRIP_TICKET_FAILED"]}},
            ];
            query =  { promo: { $exists: false } , "status.status_code" : {"$in" : [
            status.order.created.status_code,
            status.order.revised.status_code,
            status.order.rejected.status_code,
            status.delivery.rejected.status_code,
            status.invoice.rejected.status_code,
            status.tripticket.failed.status_code
            ]}};
            $scope.title2 = "SALES ORDERS"
            $scope.addUrl2 = "/#/sales/order/add";

            $scope.dtColumns2 = Library.DataTable.columns(columns2,buttons2);
            $scope.dtOptions2 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          //dash-proforma
           var columns3 = [
              $scope.structure.pfno, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons3 = [
              {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/proforma/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/print/sales/proforma/",title:"Print Record",icon:"fa fa-print"},
            ];
            query = {"pfno": { "$exists": true }, "status.status_code" : {"$in" : [
            status.proforma.created.status_code,
            status.proforma.revised.status_code,
            status.proforma.rejected.status_code,
            status.delivery.rejected.status_code
             ]}};

            $scope.title3 = "PROFORMA INVOICE"
            $scope.addUrl3 = "/#/sales/proforma/add";

            $scope.dtColumns3 = Library.DataTable.columns(columns3,buttons3);
            $scope.dtOptions3 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });
          break;
        case "Sales Assistant" :
        $scope.ajax_ready = false;
        Structure.Sales.query().$promise.then(function(data){
          $scope.ajax_ready = true;
          $scope.structure = data[0];
          var status = Library.Status.Sales;
          var query = {};

          //dash-salesOrder
            var columns = [
            $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/sales/order/edit/",title:"Edit Record",icon:"fa fa-edit"},
            {url:"/#/sales/order/reschedule/",title:"Approve Record",icon:"fa fa-upload",exclude:{key:"trpno"}},
            {url:"/#/consignment/order/reschedule/",title:"Reschedule Record",icon:"fa fa-truck", state:{statusArray:["TRIP_TICKET_FAILED"]}},
            ];
            query =  { promo: { $exists: false } , "status.status_code" : {"$in" : [
            status.order.created.status_code,
            status.order.revised.status_code,
            status.order.rejected.status_code,
            status.delivery.rejected.status_code,
            status.invoice.rejected.status_code,
            status.tripticket.failed.status_code
            ]}};
            $scope.title = "SALES ORDERS"
            $scope.addUrl = "/#/sales/order/add";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

          //dash-proforma
           var columns3 = [
              $scope.structure.pfno, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons3 = [
              {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/proforma/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/print/sales/proforma/",title:"Print Record",icon:"fa fa-print"},
            ];
            query = {"pfno": { "$exists": true }, "status.status_code" : {"$in" : [
            status.proforma.created.status_code,
            status.proforma.revised.status_code,
            status.proforma.rejected.status_code,
            status.delivery.rejected.status_code
             ]}};

            $scope.title3 = "PROFORMA INVOICE"
            $scope.addUrl3 = "/#/sales/proforma/add";

            $scope.dtColumns3 = Library.DataTable.columns(columns3,buttons3);
            $scope.dtOptions3 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
        });
          break;
        case "Sales Executive" :
          $scope.ajax_ready = false;
          Structure.Sales.query().$promise.then(function(data){
            $scope.ajax_ready = true;
            $scope.structure = data[0];
            var status = Library.Status.Sales;
            var query = {};


            var columns = [
            $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            var buttons = [
            {url:"/#/sales/order/read/",title:"View Record",icon:"fa fa-folder-open"},
            ];
            query =  { promo: { $exists: false } , "status.status_code" : {"$in" : [
            status.order.created.status_code,
            status.order.revised.status_code,
            status.order.rejected.status_code,
            status.delivery.rejected.status_code,
            status.invoice.rejected.status_code,
            status.tripticket.failed.status_code
            ]}};

            $scope.title = "SALES ORDERS"
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));
          });
          break;
        // case "Educator" :
        //   break;
        default:
          console.log("There is no matched positions");

      }

    });

  });
  if($location.path() == "/auth/logout"){
    $window.location.href = '/auth/logout';
  }
})
.controller('UserCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {
  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      console.log("chito",$location.path());
      $location.path("/auth/unauthorize");
    }
    else{
      console.log("chito",$location.path());
    }
  });

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
.controller('CustomerCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
            console.log("updating customer");
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
                console.log("saving customer");
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
.controller('ProductCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService, fileUpload) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
        product.inventory.rquantity = product.inventory.quantity;
        console.log("product.inventory.rquantity", product.inventory.rquantity);
          var content = {
            _id: product.inventory._id,
            company_name: product.inventory.company_name,
            branch: product.inventory.branch,
            price_type: product.inventory.price_type,
            shipping_address: product.inventory.shipping_address,
            quantity: product.inventory.quantity,
            rquantity: product.inventory.rquantity
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
        query = {location:$routeParams};
        $scope.movement_history = Api.Collection('inv_trans_history').query();
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

}).controller('MonitorCtrl', function (Api, $scope, $http, $window, $filter, $routeParams, $location, Structure, Library, Session) {

    $scope.ajax_ready = false;
    Structure.Products.query().$promise.then(function(data){
      $scope.structure = data[0];
      $scope.ajax_ready = true;

      $scope.formInit = function(){
        $scope.products =  Api.Collection('products').query();
      };
    });

  var duplicate = [];
    $scope.traceDuplicate = function() {
      var no_inv = "NI";
      for (var x in $scope.products) {
        var temp = $scope.products[x];
        for (var y in $scope.products) {
          if ($scope.products[x].bl_code == $scope.products[y].bl_code && (y!=x)) {
            duplicate.push($scope.products[x]);
            console.log("x: ",$scope.products[x].bl_code+"-"+$scope.products[x].name+"-"+$scope.products[x]._id+"--"+$scope.products[x].inventories[0].quantity+"-"+$scope.products[x].inventories[0].rquantity);
            console.log("y: ",$scope.products[y].bl_code+"-"+$scope.products[y].name+"-"+$scope.products[y]._id+"--"+$scope.products[x].inventories[0].quantity+"-"+$scope.products[x].inventories[0].rquantity);
            // console.log("y: ",$scope.products[y]);
          }
        }
      }
    $scope.duplicate = duplicate;
    }


    // $scope.total = $scope.products.length;

    $scope.duplicate = {};
    // for (var i in ) {
    //   array[i]
    // }





  //
  // $scope.ajax_ready = false;
  // Structure.Products.query().$promise.then(function(data){
  //   $scope.ajax_ready = true;
  //   $scope.products =  Api.Collection('products');
  // };


  console.log($scope.products);
  //
  //   $scope.formInit = function(){
  //   $scope.products =  Api.Collection('products');
  //   }
}).controller('UploadInventoriesCtrl', function ($scope, $http, $window, $filter, $routeParams, $location, Structure, Library, Session, Api, CustomApi, popupService, fileUpload) {

  Session.get(function(client) {
    if(Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  console.log($scope.inventory_locations);
  $scope.title = "UPLOAD PRODUCT INVENTORY";
  $scope.showUpload = true;
  $scope.showConfirmUpdate = false;
  $scope.update_finished = false;

  $scope.uploadFile = function(){
    var inventory_csv = $scope.upload.inventory;
    var uploadUrl = '/api/upload/csv';
    if(inventory_csv.name){
      fileUpload.uploadFileToUrl('inventory_file', inventory_csv, uploadUrl,function(err,data){
        $scope.inventories = data;
      });
    }
    $scope.showUpload = false;
  };

// {"inventories": {"$in":[{_id:"5487b197e1ff103526e687c4"}]}}
  $scope.na_products = [];
  $scope.approveData = function(inventories) {
  var ctr = 0;
  var na_product = {};
  async.each(inventories, function(item, callback) {
    console.log(ctr, "____ctr____");
    if(item.bl_code){
      CustomApi.Collection('products').get({key : 'bl_code', value : item.bl_code}).$promise.then(function(products){
          ctr ++;
          if (products && products.bl_code) {
            var isLocationFound = false;
            for(var i in products.inventories){
              if (products.inventories[i]._id == $scope.inventory_location) {
                isLocationFound = true;
                products.inventories[i].quantity = item.quantity;
                products.inventories[i].rquantity = item.quantity;
                products.$update(function(){
                  callback();
                });
              }
            }
            if(!isLocationFound){
              console.log("inventory_location not found", i);
              if(!(products.inventories instanceof Array)){
                products.inventories = [];
              }
              products.inventories.push({
                _id : $scope.inventory_location,
                quantity : item.quantity,
                rquantity : item.quantity,
                });
              products.$update(function(){
                callback();
              });
            }
          }
          else {
            na_product = {};
            na_product.bl_code = item.bl_code;
            na_product.name = item.name;
            na_product.quantity = item.quantity;
            console.log(ctr, ") no PP", na_product);
            $scope.na_products.push(na_product);
          }
      });
    }
    else{
      console.log("no item bl_code", item.bl_code);
    }
  },function(err){
    if(err){
      console.log(err);
    }
  });
    $scope.update_finished = true;
    $scope.showUpload = false;
    $scope.showConfirmUpdate = true;
  }

  // if (  $scope.update_finished == true) {
  //   window.alert("There are non-existing Product Profile.");
  //   $scope.na_products = [];
  // }
})
.controller('UploadPricesCtrl', function ($scope, $http, $window, $filter, $routeParams, $location, Structure, Library, Session, Api, CustomApi, popupService, fileUpload) {

  $scope.title = "UPLOAD PRODUCT PRICES";
  $scope.showUpload = true;
  $scope.showConfirmUpdate = false;
  $scope.update_finished = false;

  $scope.uploadFile = function(){
    var prices_csv = $scope.upload.file;
    var uploadUrl = '/api/upload/prices';
    if(prices_csv.name){
      fileUpload.uploadFileToUrl('prices_file', prices_csv, uploadUrl,function(err,data){
        $scope.products_prices = data;
      });
    }
    $scope.showUpload = false;
  };

  $scope.na_products = [];
  $scope.up_products = [];

  $scope.approveData = function(products_prices) {
  var ctr = 0;
  var na_product = {};
  async.each(products_prices, function(item, callback) {
    console.log(ctr, "--ctr");
    if(item.bl_code){
      CustomApi.Collection('products').get({key : 'bl_code', value : item.bl_code}).$promise.then(function(products){
          ctr ++;
          if (products.bl_code == item.bl_code) {
            if (isNaN(item.international_cost)) item.international_cost=0;
            if (isNaN(item.retail_price)) item.retail_price=0;
            if (isNaN(item.professional_price)) item.professional_price=0;
            if (isNaN(item.sub_distributor_price)) item.sub_distributor_price=0;

                products.international_cost = item.international_cost;
                products.retail_price = item.retail_price;
                products.professional_price = item.professional_price;
                products.sub_distributor_price = item.sub_distributor_price;

                $scope.up_products.push(products);
                products.$update(function(){
                  callback();
                });
          }
          else {
            na_product = {};

            na_product.bl_code = item.bl_code;
            na_product.international_cost = item.international_cost;
            na_product.retail_price = item.retail_price;
            na_product.professional_price = item.professional_price;
            na_product.sub_distributor_price = item.sub_distributor_price;

            console.log(ctr, ") no PP", na_product);
            $scope.na_products.push(na_product);
          }
      });
    }
    else{
      console.log("Error. No item");
    }
  },function(err){
    if(err){
      console.log(err);
    }
  });
    $scope.update_finished = true;
    $scope.showUpload = false;
    $scope.showConfirmUpdate = true;
  }
})
.controller('SalesCtrl', function ($scope, $window, $filter, $routeParams,  $location, Structure, Library, Session, Api) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
        case "promo" :

            columns = [
              $scope.structure.promo, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/sales/promo/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/promo/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/print/sales/promo/",title:"Print Record",icon:"fa fa-print"},
            ];
            query = {"promo": { "$exists": true }, "status.status_code" : {"$in" : [
              status.order.created.status_code,
              status.order.revised.status_code,
              status.order.rejected.status_code,
              status.delivery.rejected.status_code,
              status.invoice.rejected.status_code,
              status.tripticket.failed.status_code
             ]}};

            $scope.title = "ADD PROMO SALES ORDER"
            $scope.addUrl = "/#/sales/promo/add";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "proforma" :

            columns = [
              $scope.structure.pfno, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
              $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/sales/proforma/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/print/sales/proforma/",title:"Print Record",icon:"fa fa-print"},
            ];
            query = {"pfno": { "$exists": true }, "status.status_code" : {"$in" : [
            status.proforma.created.status_code,
            status.proforma.revised.status_code,
            status.proforma.rejected.status_code,
            status.delivery.rejected.status_code
             ]}};

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
              {url:"/#/sales/order/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/sales/order/reschedule/",title:"Approve Record",icon:"fa fa-upload",exclude:{key:"trpno"}},
              {url:"/#/consignment/order/reschedule/",title:"Reschedule Record",icon:"fa fa-truck", state:{statusArray:["TRIP_TICKET_FAILED"]}},
              ];
            query =  { promo: { $exists: false } , "status.status_code" : {"$in" : [
                status.order.created.status_code,
                status.order.revised.status_code,
                status.order.rejected.status_code,
                status.delivery.rejected.status_code,
                status.invoice.rejected.status_code,
                status.tripticket.failed.status_code
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
          {url:"/#/sales/order/approve/",title:"Approve Record",icon:"fa fa-gear"},
          ];
          query = {"status.status_code" : {"$in" : [status.order.override.status_code]}};
          $scope.title = "APPROVE SALES ORDERS";
          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));



          var columns1 = [
            $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
            $scope.structure.delivery_method, $scope.structure.customer.payment_term, $scope.structure.status.status_name
          ];
          var buttons1 = [
          {url:"/#/sales/proforma/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/sales/proforma/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];
          query = {"status.status_code" : {"$in" : [status.proforma.override.status_code]}};
          $scope.title1 = "APPROVE PROFORMA INVOICE";
          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "delivery" :

          columns = [
            $scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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
          $scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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
          $scope.structure.pfno,$scope.structure.sono,$scope.structure.drno,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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
          $scope.structure.pfno,$scope.structure.sono,$scope.structure.drno,$scope.structure.sino,$scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
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
            {url:"/#/sales/return/create/",title:"Approve Record",icon:"fa fa-level-up"}
          ];
          query = { "status.status_code" : {"$in" : [
            status.tripticket.delivered.status_code,
            status.payment.updated.status_code,
            status.returned.rejected.status_code,
            status.payment.created.status_code,
            status.memo.rejected.status_code
          ]}};
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

          query = { "status.status_code" : {"$in" : [status.returned.created.status_code, status.returned.revised.status_code]}};
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

          query = { "status.status_code" : {"$in" : [status.returned.created.status_code, status.returned.revised.status_code]}};
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
          $scope.structure.pfno, $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.delivery_date, $scope.structure.customer.payment_term,$scope.structure.total_amount_due, $scope.structure.status.status_name
          ];
          // filter:{key:"pmno"}},
          buttons = [
          {url:"/#/sales/payment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/sales/payment/create/",title:"Create Payment Record",icon:"fa fa-save", state:{statusArray:["TRIP_TICKET_DELIVERED","TRIP_TICKET_CREATED", "PROFORMA_INVOICE_CREATED","MEMO_APPROVED"]}},
          {url:"/#/sales/payment/update/",title:"Update Record",icon:"fa fa-edit", state:{statusArray:["PAYMENT_CREATED", "PAYMENT_PARTIALED", "TRIP_TICKET_DELIVERED"]}},
          {url:"/#/sales/payment/approve/",title:"Approve Record",icon:"fa fa-gear", state:{statusArray:["PAYMENT_UPDATED"]}},
          ];

          query = { "status.status_code" : {"$in" : [status.invoice.approved.status_code, status.proforma.created.status_code,
                                                      status.memo.approved.status_code, status.payment.updated.status_code,
                                                      status.payment.created.status_code, status.tripticket.delivered.status_code,
                                                      status.tripticket.created.status_code,
                                                      status.proforma.approved.status_code, status.proforma.revised.status_code,
                                                      status.payment.partialed.status_code, status.payment.rejected.status_code
                                                      ]}};
          $scope.title = "PAYMENT";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "print" :
          columns = [
          $scope.structure.customer.company_name, $scope.structure.customer.sales_executive,
          $scope.structure.delivery_method, $scope.structure.drno, $scope.structure.sino
          ];

          buttons = [
          {url:"/#/print/sales/delivery/",title:"View Record",icon:"fa fa-truck"},
          {url:"/#/print/sales/invoice/",title:"Create Payment Record",icon:"fa fa-file"},

          ];

          query = { "status.status_code" : {"$in" : [status.delivery.approved.status_code,status.invoice.approved.status_code, status.printed.dr.status_code, status.printed.si.status_code]}};
          $scope.title = "Print DR nd SI";

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
      }
    };

  });
})
.controller('ReportCtrl', function ($scope, $window, $filter, $routeParams, $location, Structure, Library, Session, Api) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

$scope.ajax_ready = false;
Structure.Sales.query().$promise.then(function(data){
  $scope.structure = data[0];
  $scope.ajax_ready = true;
  var status = Library.Status.Sales;
  var columns = [];
  var buttons = [];
  var query = {};
  // query.status = {"status_code" : {"$in" : [status.payment.confirmed.status_code]}};
  var now = new Date();
  var date = now.getDate();
  var year = now.getFullYear();
  var month = now.getMonth();
  var start_date = new Date(year,month,date,0,0);
  var end_date = new Date(year,month,date,23,59);
  query.payment_date = {"$gte": start_date, "$lte": end_date};

$scope.init = function(){
  var module = $routeParams.module;
  var type = $routeParams.type;
  $scope.type = type;
  $scope.report_periods =  Api.Collection('report_periods').query();
  $scope.products =  Api.Collection('products').query();
  $scope.brands =  Api.Collection('brands').query();
  $scope.customers = Api.Collection('customers').query();
  var query = {"position":"Sales Executive"};
  $scope.sales_executives = Api.Collection('users',query).query();
  $scope.users = Api.Collection('users').query();
  $scope.report = {};

  var generateReport = function (query,api_url) {
    var query = {};
    console.log("generating");
    if (api_url == "/reports/sales/customer" && $scope.report.customer) {
      console.log("1");
      query["customer.company_name"] = $scope.report.customer;
    }
    if (api_url == "/reports/sales/product" && $scope.report.product.bl_code) {
      console.log("2");
      query["ordered_items.bl_code"] = $scope.report.product.bl_code;
    }
    if (api_url == "/reports/sales/brand" && $scope.report.brand) {
      console.log("3");
      query["ordered_items.brand"] = $scope.report.brand;
    }
    if (api_url == "/reports/sales/se" && $scope.report.sales_executive) {
      console.log("4");
      query["customer.sales_executive"] = $scope.report.sales_executive;
    }
    console.log($scope.report.value, "value");
    if ($scope.report.start_date && $scope.report.end_date ) {
      $scope.report.value = "";
      var start_date = $scope.report.start_date;
      var end_date = $scope.report.end_date;
      if (start_date == "Invalid Date") {
        window.alert("Invalid input, please check the date format.");
      }
      query.payment_date = {"$gte": start_date, "$lte": end_date};
      console.log("query : ", JSON.stringify(query));
      $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
    }
    else if ($scope.report.period && $scope.report.value || $scope.report.year) {
      var period = $scope.report.period;
      var value = $scope.report.value;
      var start_year = 1;
      var start_month = 0;
      var start_day = 1;
      var start_hours = 0;
      var start_minute = 0;

    var splitDate = function () {
       start_year = Number($scope.report.value.split("/")[2]);
       start_month = Number($scope.report.value.split("/")[0])-1;
       start_day = Number($scope.report.value.split("/")[1]);
      }

    switch (period) {
      case 'day':
        splitDate();
        var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
        var end_date = new Date(start_year,start_month,start_day+1,start_hours,start_minute);
        if (start_date == "Invalid Date") {
          window.alert("Invalid input, please check the date format.");
        }
        query.payment_date = {"$gte": start_date, "$lte": end_date};
        console.log("query : ", JSON.stringify(query));
        $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
      break;
      case 'week':
        splitDate();
        var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
        var end_date = new Date(start_year,start_month,start_day+7,start_hours,start_minute);
        if (start_date == "Invalid Date") {
          window.alert("Invalid input, please check the date format.");
        }
        query.payment_date = {"$gte": start_date, "$lte": end_date};
        console.log("query : ", JSON.stringify(query));
        $scope.title = "SALES REPORT : WEEKLY"
        $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
      break;
      case 'month':
        start_day = 1;
        start_month = $scope.report.value;
        start_year = $scope.report.year;
      console.log(start_year, start_month, start_day);
        var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
      console.log(start_year, start_month, start_day);
        if (start_month==12) {
          start_month = 0;
          start_year = start_year + 1;
        }
        var end_date = new Date(start_year,start_month+1,start_day,start_hours,start_minute);
      console.log(end_date);
        if (start_date == "Invalid Date") {
          window.alert("Invalid input, please check the date format.");
        }
        query.payment_date = {"$gte": start_date, "$lte": end_date};
        console.log("query nga : ", JSON.stringify(query));

        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
      break;
      case 'quarter':
        start_year = $scope.report.year;
        switch ($scope.report.quarter) {
        case '1':
          start_month = 0;
          break;
        case '2':
          start_month = 3;
          break;
        case '3':
          start_month = 6;
          break;
        case '4':
          start_month = 9;
          break;
        default:
          window.confirm("The Quarter is out of range.");
        }

        if (start_year < 2010 || start_year > 2020 ) {
          window.confirm("The Year is out of range.");
        }
        var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
        start_month = start_month==12 ? 0 : start_month;
        var end_date = new Date(start_year,start_month+3,start_day,start_hours,start_minute);
        if (start_date == "Invalid Date") {
          window.alert("Invalid input, please check the date format.");
        }
        query.payment_date = {"$gte": start_date, "$lte": end_date};
        console.log("query : ", JSON.stringify(query));
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
      break;
      case 'annual':
        var start_year = $scope.report.year;
        if (start_year < 2010 || start_year > 2020 ) {
          window.confirm("The Year is out of range.");
        }
        var start_date = new Date(start_year,start_month,start_day,start_hours,start_minute);
        start_month = start_month==12 ? 0 : start_month;
        var end_date = new Date(start_year,start_month+12,start_day,start_hours,start_minute);
        if (start_date == "Invalid Date") {
          window.alert("Invalid input, please check the date format.");
        }
        query.payment_date = {"$gte": start_date, "$lte": end_date};
        console.log("query : ", JSON.stringify(query));
        $scope.dtOptions = Library.DataTable.options(api_url+"?filter="+encodeURIComponent(JSON.stringify(query)));
      break;
      default:
      break;
      }
    }
    else {
      window.alert("Please fill up the Reports Period Properly.");
    }
  }

  switch(type){
    case "complete" :
      columns = [
      {"name": "customer","title": "Company Name"},
      {"name": "sales_executive", "title" :"Sales Executive"},
      {"name": "delivery_method", "title": "Delivery Method"},
      {"name": "payment_term", "title": "Payment Term"}
      ];
      $scope.title = "COMPLETED SALES REPORT "
      console.log(JSON.stringify(query));
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/complete?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/complete");
      }

      break;
    case "customer" :
      columns = [
      {"name": "customer","title": "Company Name"},
      {"name": "branch", "title" :"Branch"},
      {"name": "type", "title": "Type"},
      {"name": "total_amount_due", "title": "Total Amount Due"},
      ];
      query["customer.company_name"] = $scope.report.customer;
      $scope.title = "COMPLETED SALES REPORT "
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/customer?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/customer");
      }

      break;
    case "product" :
      columns = [
      {"name": "name","title": "Product"},
      {"name": "bl_code","title": "Code"},
      {"name": "brand","title": "Brand"},
      {"name": "quantity","title": "Quantity"},
      {"name": "total","title": "Total"}
      ];
      $scope.title = "SALES REPORT BY PRODUCT"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/product?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/product");
      }

      break;
    case "brand" :
      columns = [
      {"name": "brand","title": "Brand"},
      {"name": "quantity","title": "Quantity"},
      {"name": "total","title": "Total"}
      ];
      $scope.title = "SALES REPORT BY BRAND"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/brand?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/brand");
      }
      break;
    case "se" :
      columns = [
      {"name": "sales_executive","title": "Sales Executive"},
      {"name": "total_amount_due", "title": "Total Amount Due"}
      ];
      $scope.title = "COMPLETED SALES REPORT "
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/se?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/se");
      }
      break;
    case "inventory" :
      columns = [
      {"name": "customer","title": "Company Name"},
      {"name": "branch", "title" :"Branch"},
      {"name": "type", "title": "Type"},
      {"name": "total_amount_due", "title": "Total Amount Due"},
      ];

      $scope.title = "COMPLETED SALES REPORT "
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/reports/sales/inventory?filter="+encodeURIComponent(JSON.stringify(query)));
      $scope.dtOptions
        .withTableTools('/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons(['copy','print', {'sExtends': 'xls','sButtonText': 'Download'}]);

      $scope.generateReport = function(){
        generateReport(query,"/reports/sales/se");
      }

      break;
    }
  };
});
  })
.controller('SalesOrderCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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

  var query = {"position":"Sales Executive"};
  $scope.sales_executives = Api.Collection('users',query).query();

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

  var displayItemQuantity = function() {
    // $scope.totalQuantity=0;
    // for(var i=0;i<$scope.sales.ordered_items.length; i++){
    // $scope.sales.totalQuantity += $scope.sales.ordered_items[i].quantity;
    // console.log("totalQuantity",$scope.sales.totalQuantity);
    // }
    console.log("items",$scope.sales.ordered_items);
  }

  $scope.addOrder = function(sales){
    var no_inventory_location = false;
    var item = angular.copy(sales.item);
    if( item && item.name && item.quantity && item.quantity ){

      console.log(item);
      var isInventoryExist = false;
      var insufficient_item = [];
      if (item.uom == "Package" || item.uom == "Promo") {
        console.log("UOM", item.uom);
        isInventoryExist = true;
      }
      else {
      for(var i in item.inventories){
        if(item.inventories[i]._id == $scope.sales.inventory_location && $scope.sales.item.quantity <= item.inventories[i].rquantity){
          isInventoryExist = true;
        }
      }
      }
      for(var i in item.inventories){
        if(item.inventories[i]._id == $scope.sales.inventory_location && $scope.sales.item.quantity <= item.inventories[i].rquantity){
          isInventoryExist = true;
        }
      }
      // if(isInventoryExist)
      if(true){
        item.override = item.override ? item.override : "NORMAL";
        if(sales.customer.price_type == "Professional"){
          item.price = item.professional_price;
        }
        if(sales.customer.price_type == "Retail"){
          item.price = item.retail_price;
        }
        if(item.override != "NORMAL"){
          item.price = item.override;
          item.total = 0.00;
        }
        if(!isNaN(item.override)){
          item.price = item.professional_price+" ("+item.override+"% discount"+")";
          item.total = (item.professional_price - ((item.override/100)*item.professional_price)) * item.quantity;
        }
        else if(!isNaN(item.price)){
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
      else{
        window.alert("The stock is insufficient. Please check your inventory location.");
      }

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
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
     );
     $scope.sales.discount = computation.totalDiscount;
     $scope.sales.total_vat = computation.vatableSales;
     $scope.sales.total_amount_due = computation.totalAmountDue;
     $scope.sales.zero_rate_sales = computation.zeroRatedSales;
     $scope.sales.withholding_tax = computation.withholdingTax;
    //  displayItemQuantity();

     $scope.sales.totalQuantity=0;
     for(var i=0;i<$scope.sales.ordered_items.length; i++){
     $scope.sales.totalQuantity += $scope.sales.ordered_items[i].quantity;
     console.log("totalQuantity",$scope.sales.totalQuantity);
     }
  }

  $scope.reCompute = function(sales){
    if($scope.sales.customer){
      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        0,
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
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
    // displayItemQuantity();
    $scope.sales.totalQuantity=0;
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
    $scope.sales.totalQuantity += $scope.sales.ordered_items[i].quantity;
    console.log("totalQuantity",$scope.sales.totalQuantity);
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
      }
      else{
        $scope.sales.status = status.order.created;
        //$scope.sales.triggerInventory  = "OUT";
      }
    $scope.sales.$save(function(){
      $location.path('/sales/index/order');
      return false;
    });
    }
  }
  if(action == 'edit'){
    $scope.title = "EDIT SALES ORDER - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.override;
      }
      else{
        if ($scope.sales.status.status_code == status.invoice.rejected.status_code || $scope.sales.status.status_code == status.delivery.rejected.status_code || $scope.sales.status.status_code == status.order.revised.status_code) {
          $scope.sales.status = status.order.revised;
          console.log("order revised");
        }
        else {
        $scope.sales.status = status.order.created;
        //    $scope.sales.triggerInventory  = "OUT";
        console.log("ordinary order");
        }
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
    // displayItemQuantity();

  }
  if(action == 'approve'){
    console.log(action);
    $scope.title = "APPROVE SALES ORDER - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.created;
        console.log("status order created");
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/override');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.order.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };

     $scope.deleteSales = function(){
      $scope.sales.status = status.order.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };
    // displayItemQuantity();
  }
  if(action == 'reschedule'){
    $scope.title = "RESCHEDULE SALES ORDER - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
        $scope.sales.status = status.order.rescheduled;
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };
  }//resched

})
.controller('SalesPromoCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
  $scope.promo = Api.Collection('promo').query();
  var query = {"type":"Retail"};
  $scope.inventory_locations = Api.Collection('customers',query).query();
  var status = Library.Status.Sales;



  $scope.PromoChange = function(){
    console.log("promo - change");
    var query = {name:$scope.sales.promo};
  Api.Collection('promo',query).query(function (data) {
    $scope.promo_products = data[0];
    console.log($scope.promo_products.name);
    $scope.sales.price = data[0].price;
    });
    $scope.promoTypeChange();
  };

  $scope.promoTypeChange = function (){
    console.log("promotypechanged", $scope.promo_products);
    if ($scope.sales.promo_type == "NORMAL") {
      console.log("got required_items");
      $scope.products = $scope.promo_products.required_items;
    }

    else if ($scope.sales.promo_type == "FREEBIE") {
      $scope.products = $scope.promo_products.freebies;
      console.log("got freebies");
    }
  };

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

  var displayItemQuantity = function() {
    console.log("displayItemQuantity");
    for(var i=0;i<$scope.sales.ordered_items.length; i++){
    $scope.sales.totalQuantity=0;
    $scope.sales.totalQuantity += $scope.sales.ordered_items[i].quantity;
    console.log($scope.sales.totalQuantity);
    }

  }

  $scope.addOrder = function(sales){
    var no_inventory_location = false;
    var item = angular.copy(sales.item);
    if( item && item.name && item.quantity){
      console.log(item);
      var isInventoryExist = false;
      var insufficient_item = [];
      for(var i in item.inventories){
        if(item.inventories[i]._id == $scope.sales.inventory_location && $scope.sales.item.quantity <= item.inventories[i].rquantity){
          isInventoryExist = true;
        }
      }
      if(isInventoryExist){
        item.override = item.override ? item.override : "NORMAL";
        if(sales.customer.price_type == "Professional"){
          item.price = item.professional_price
        }
        if(sales.customer.price_type == "Retail"){
          item.price = item.retail_price;
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
      else{
        window.alert("The stock is insufficient. Please check your inventory location.");
      }
    }
      $scope.sales.subtotal = $scope.sales.price;
      $scope.sales.isNeedApproval = false;

      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        0,
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
      );
      $scope.sales.discount = computation.totalDiscount;
      $scope.sales.total_vat = computation.vatableSales;
      $scope.sales.total_amount_due = computation.totalAmountDue;
      $scope.sales.zero_rate_sales = computation.zeroRatedSales;
      $scope.sales.withholding_tax = computation.withholdingTax;
      displayItemQuantity();
    }

  $scope.reCompute = function(sales){
    if($scope.sales.customer){
      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        0,
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
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
    $scope.title = "VIEW PROMO SALES ORDER";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'add'){
    $scope.title = "ADD PROMO SALES ORDER";
    var Sales = Api.Collection('sales');
    $scope.sales = new Sales();

    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.override;
      }
      else{
        $scope.sales.status = status.order.created;
        //$scope.sales.triggerInventory  = "OUT";
      }
    $scope.sales.$save(function(){
      $location.path('/sales/index/order');
      return false;
    });
    }
  }
  if(action == 'edit'){
    $scope.title = "EDIT SALES ORDER  - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.order.override;
      }
      else{
        if ($scope.sales.status.status_code == status.invoice.rejected.status_code || $scope.sales.status.status_code == status.delivery.rejected.status_code || $scope.sales.status.status_code == status.order.revised.status_code) {
          $scope.sales.status = status.order.revised;
          console.log("order revised");
        }
        else {
        $scope.sales.status = status.order.created;
        //    $scope.sales.triggerInventory  = "OUT";
        console.log("ordinary order");
        }
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
    console.log(action);
    $scope.title = "APPROVE SALES ORDER - Ref.No.: "+ id;
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
    $scope.rejectSales = function(){
      $scope.sales.status = status.order.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };
  }
  if(action == 'reschedule'){
    $scope.title = "RESCHEDULE SALES ORDER - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
        $scope.sales.status = status.order.rescheduled;
      $scope.sales.$update(function(){
        $location.path('/sales/index/order');
        return false;
      });
    };
  }//resched

})
.controller('ShipmentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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

          query = { "status.status_code" : {"$in" : [status.created.status_code, status.updated.status_code, status.rejected.status_code ]}};

          $scope.title = "NEW SHIPMENTS"
          $scope.addUrl = "/#/shipment/add"
          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "approve" :
          console.log("approving");
          columns = [
          $scope.structure.shipno, $scope.structure.supplier, $scope.structure.reference_number,
          $scope.structure.arrival_date, $scope.structure.notes, $scope.structure.status.status_name
          ];

          buttons = [
          {url:"/#/shipment/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/shipment/approve/",title:"Approve Shipment",icon:"fa fa-gear"}
          ];

          var status = Library.Status.Shipments;
          query = { "status.status_code" : {"$in" : [status.created.status_code, status.updated.status_code]}};

          $scope.title = "SHIPMENTS FOR APPROVAL"
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

          $scope.title1 = "APPROVED SHIPMENTS"
          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/shipments?filter="+encodeURIComponent(JSON.stringify(query)));


        break;
      }//end of switch
  };


  $scope.formInit = function(){
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.suppliers = Api.Collection('suppliers').query();
    $scope.products = Api.Collection('products').query();
    $scope.conditions = Api.Collection('conditions').query();
    var query = {"type":"Retail"};
    $scope.inventory_locations = Api.Collection('customers',query).query();
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
      $scope.title = "VIEW SHIPMENT " + id;
      $scope.shipment =  Api.Collection('shipments').get({id:$routeParams.id},function(){
      });
    }

    if (action == 'edit') {
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
    }

  if(action == 'approve'){
    $scope.title = "APPROVE SHIPMENT "+ id;
    $scope.shipment =  Api.Collection('shipments').get({id:$routeParams.id},function(){
      console.log($scope.shipment.blcode);
    });
    $scope.saveShipment = function(){
      $scope.shipment.status = status.approved;
      $scope.shipment.$update(function(){
        $location.path('/shipment/index/approve');
        return false;
      });
    };
    $scope.rejectShipment=function(shipment){
        $scope.shipment.status = status.rejected;
        $scope.shipment.$update(function(){
          $location.path('/shipment/index/aprove');
          return false;
        });
    };
  }

  $scope.addItem = function(shipment){
    var shipment_item = angular.copy(shipment.item);
    if(shipment_item){
      delete shipment_item.inventories;
    }
    if(shipment_item && shipment_item.name && shipment_item.quantity && shipment_item.cost && shipment_item.condition){
      if($scope.shipment.shipment_items){
        $scope.shipment.shipment_items.push(shipment_item);
      }
      else{
        $scope.shipment.shipment_items = [shipment_item];
      }
    }
    delete shipment.item ;
  }
  $scope.removeItem = function(index){
    $scope.shipment.shipment_items.splice(index, 1);
  }
}

  });

})
.controller('PurchaseCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
      query = { "status.status_code" : {"$in" : [status.created.status_code, status.updated.status_code]}};

      $scope.title = "PURCHASE"
      $scope.addUrl = "/#/purchase/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/purchases?filter="+encodeURIComponent(JSON.stringify(query)));
    };


    $scope.formInit = function(){
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
        $scope.title = "VIEW PURCHASE " + id;
        $scope.purchase =  Api.Collection('purchases').get({id:$routeParams.id},function(){
        });
      }

      if (action == 'edit') {
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

      $scope.addItem = function(container_item){
        var purchase_item = angular.copy(container_item.product);
        delete purchase_item.inventories;
        if(purchase_item.name && purchase_item.quantity && purchase_item.cost){
          if($scope.purchase.purchase_items){
            $scope.purchase.purchase_items.push(purchase_item);
            }
          else
            {
            $scope.purchase.purchase_items = [purchase_item];
           }
           container_item.product = {};
        }
      }
      $scope.removeItem = function(index){
        $scope.purchase.purchase_items.splice(index, 1);
      }
    }

  });

})
  .controller('SalesProformaCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
    console.log("calling customer change");
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

var displayItemQuantity = function() {
  $scope.sales.totalQuantity=0;
  for(var i=0;i<$scope.sales.ordered_items.length; i++){
  $scope.sales.totalQuantity += $scope.sales.ordered_items[i].quantity;
  console.log("totalQuantity",$scope.sales.totalQuantity);
  }
}

  $scope.addOrder = function(sales){
    var no_inventory_location = false;
    var item = angular.copy(sales.item);
    if( item && item.name && item.quantity && item.quantity ){

      console.log(item);
      var isInventoryExist = false;
      var insufficient_item = [];
      for(var i in item.inventories){
        if(item.inventories[i]._id == $scope.sales.inventory_location && $scope.sales.item.quantity <= item.inventories[i].rquantity){
          isInventoryExist = true;
        }
      }
      if(isInventoryExist){
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
      else{
        window.alert("The stock is insufficient. Please check your inventory location.");
      }

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
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales
     );
     $scope.sales.discount = computation.totalDiscount;
     $scope.sales.total_vat = computation.vatableSales;
     $scope.sales.total_amount_due = computation.totalAmountDue;
     $scope.sales.zero_rate_sales = computation.zeroRatedSales;
     $scope.sales.withholding_tax = computation.withholdingTax;
     displayItemQuantity();
  }

  $scope.reCompute = function(sales){

    if($scope.sales.customer){
      console.log($scope.sales.subtotal,
        0,
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
        $scope.sales.isWithholdingTax,
        $scope.sales.isZeroRateSales);
      var computation = Library.Compute.Order(
        $scope.sales.subtotal,
        0,
        $scope.sales.customer.discount.replace(" %","")/100 || 0,
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
    displayItemQuantity();
  }

  if(action == 'read'){
    displayItemQuantity();
    $scope.title = "VIEW PROFORMA INVOICE";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }
  if(action == 'add'){

    $scope.title = "ADD PROFORMA INVOICE";
    var Sales = Api.Collection('sales');
    $scope.sales = new Sales();

    $scope.saveSales = function(){
      if($scope.sales.isNeedApproval){

        $scope.sales.status = status.proforma.override;
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
    displayItemQuantity();
    $scope.title = "EDIT PROFORMA INVOICE"+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      if ($scope.sales.status.status_code == status.delivery.rejected.status_code || $scope.sales.status.status_code == status.proforma.revised.status_code ) {
        $scope.sales.status = status.proforma.revised;
      }
      if($scope.sales.isNeedApproval){
        $scope.sales.status = status.proforma.override;
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
    displayItemQuantity();
    $scope.title = "APPROVE PROFORMA INVOICE"+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.proforma.created;
      $scope.sales.$update(function(){
        $location.path('/sales/index/override');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.proforma.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/proforma');
        return false;
      });
    };
  }

})
// .controller('OldPackingCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {
//
//   Session.get(function(client) {
//     if(!Library.Permission.isAllowed(client,$location.path())){
//       $location.path("/auth/unauthorized");
//     }
//   });
//
//   $scope.ajax_ready = false;
//   Structure.Packing.query().$promise.then(function(data){
//     $scope.structure = data[0];
//     $scope.ajax_ready = true;
//     var columns = [];
//     var buttons = [];
//     var query = {};
//     $scope.init = function(){
//       columns = [
//       $scope.structure.pckno, $scope.structure.prepared_by
//       ];
//
//       buttons = [
//       {url:"/#/packing/read/",title:"View Record",icon:"fa fa-folder-open"}
//       ];
//       $scope.title = "PACKING"
//       $scope.addUrl = "/#/packing/add"
//       $scope.dtColumns = Library.DataTable.columns(columns,buttons);
//       $scope.dtOptions = Library.DataTable.options("/api/packing");
//     };
//     $scope.formInit = function(){
//
//       var id = $routeParams.id;
//       var action = $routeParams.action;
//       var statusSales = Library.Status.Sales;
//       var statusConsignments = Library.Status.Consignments;
//       $scope.inventory_locations = Api.Collection('customers',query).query();
//       $scope.ListChange = function(){
//           $scope.packing.list = [];
//           if($scope.packing.inventory_location){
//             var query = {
//               "inventory_location":$scope.packing.inventory_location,
//               "status.status_code" : {"$in" : [statusSales.order.created.status_code,statusSales.order.revised.status_code]}
//             };
//
//             Api.Collection('sales',query).query().$promise.then(function(data){
//               for(var i in data){
//                 for(var j in data[i].ordered_items){
//                   var item = {
//                     id : data[i]._id,
//                     pfno : data[i].pfno,
//                     sono : data[i].sono,
//                     customer : data[i].customer.company_name,
//                     brand : data[i].ordered_items[j].brand,
//                     product : data[i].ordered_items[j].name,
//                     quantity : data[i].ordered_items[j].quantity,
//                   };
//                   $scope.packing.list.push(item);
//                 }
//               }
//             });
//             var query1 = {
//               "inventory_location":$scope.packing.inventory_location,
//               "status.status_code" : {"$in" : [statusConsignments.order.approved.status_code]},
//               "consignment_transaction_type" : "OUT",
//             }
//             Api.Collection('consignments',query1).query().$promise.then(function(data){
//               for(var i in data){
//                 for(var j in data[i].consigned_item){
//                   var item = {
//                     id : data[i]._id,
//                     sono : data[i].cono,
//                     customer : data[i].customer.company_name,
//                     brand : data[i].consigned_item[j].brand,
//                     product : data[i].consigned_item[j].name,
//                     quantity : data[i].consigned_item[j].quantity,
//                   };
//                   $scope.packing.list.push(item);
//                 }
//               }
//             });
//             var query2 = {
//               "inventory_location":$scope.packing.inventory_location,
//               "status.status_code" : {"$in" : [statusSales.payment.created.status_code]},
//               "pfno" : {"$exists":true},
//             }
//             console.log(query2);
//             Api.Collection('sales',query2).query().$promise.then(function(data){
//               console.log(data);
//               for(var i in data){
//                 for(var j in data[i].ordered_items){
//                   var item = {
//                     id : data[i]._id,
//                     sono : data[i].pfno,
//                     customer : data[i].customer.company_name,
//                     brand : data[i].ordered_items[j].brand,
//                     product : data[i].ordered_items[j].name,
//                     quantity : data[i].ordered_items[j].quantity,
//                   };
//                   $scope.packing.list.push(item);
//                 }
//               }
//             });
//           }
//       };
//
//       $scope.action = action;
//       if(id && action == 'read'){
//         $scope.title = "VIEW PACKING " + id;
//         $scope.packing =  Api.Collection('packing').get({id:$routeParams.id});
//       }
//       if(id && action == 'edit'){
//         $scope.title = "EDIT PACKING " + id;
//         $scope.packing =  Api.Collection('packing').get({id:$routeParams.id});
//
//         $scope.deletePacking=function(packing){
//           if(popupService.showPopup('You are about to delete Record : '+packing._id)){
//             $scope.packing.$delete(function(){
//               $location.path('/packing/index');
//               return false;
//             });
//           }
//         };
//       }
//       if(action == 'add'){
//         $scope.title = "ADD PACKING";
//         var Packing = Api.Collection('packing');
//         $scope.packing = new Packing();
//         $scope.savePacking = function(){
//           $scope.packing.status = statusSales.packing.created;
//           $scope.packing.$save(function(){
//             var sono = [];
//             var cono = [];
//             async.each($scope.packing.list, function( item, callback) {
//               if(sono.indexOf(item.sono) == -1){
//                 sono.push(item.sono);
//                 Api.Collection('sales').get({id : item.id}).$promise.then(function(sales){
//                   sales.status = statusSales.packing.created;
//                   sales.pckno =  $scope.packing.pckno;
//                   sales.$update(function(){
//                     callback();
//                   });
//                 });
//               }
//               if(item.cono && cono.indexOf(item.cono) == -1){
//                 cono.push(item.cono);
//                 Api.Collection('consignments').get({id : item.id}).$promise.then(function(consignments){
//                   consignments.status = statusConsignments.packing.created;
//                   consignments.cpckno =  $scope.packing.cpckno;
//                   consignments.$update(function(){
//                     callback();
//                   });
//                 });
//               }
//
//               else{
//                 callback();
//               }
//             },function(err){
//               if(err){
//                 console.log(err);
//               }
//             });
//
//             $location.path('/packing/index');
//             return false;
//           });
//         }
//         $scope.removeItem = function(index){
//           $scope.packing.list.splice(index, 1);
//         };
//       }
//     }
//   });
// })
.controller('PackingCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  $scope.ajax_ready = false;
  var status = Library.Status.Sales;
  Structure.Sales.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};

    $scope.init = function(){
      columns = [
      $scope.structure.sono, $scope.structure.customer.company_name, $scope.structure.delivery_date, $scope.structure.status.status_name
      ];

      buttons = [
      {url:"/#/packing/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/packing/approve/",title:"View Record",icon:"fa fa-gear"}
      ];
      query = { "status.status_code" : {"$in" : [
        status.order.created.status_code,
        status.payment.partialed.status_code,
        status.order.revised.status_code,
        ]}};
      $scope.title = "SALES PACKING"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/sales?filter="+encodeURIComponent(JSON.stringify(query)));

    };

  $scope.formInit = function(){
    var query = {"type":"Retail"};
    $scope.inventory_locations = Api.Collection('customers',query).query();

    if(action == 'read'){
      $scope.title = "VIEW PACKING " + id;
      $scope.sales =  Api.Collection('sales').get({id:$routeParams.id});
    }

    if(action == 'approve'){
      $scope.title = "APPROVE PACKING - Ref.No.: "+ id;
      $scope.sales =  Api.Collection('sales').get({id:$routeParams.id});

      $scope.saveSales = function(){
        $scope.sales.status = status.packing.created;
        $scope.sales.$update(function(){
          $location.path('/packing/index');
          return false;
        });
      };
    }
  } //form init end
})
})
.controller('TripsCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Trips.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    $scope.init = function(){
      columns = [
      $scope.structure.trpno, $scope.structure.inventory_location, $scope.structure.delivery_date,
      $scope.structure.prepared_by, $scope.structure.status.status_name
      ];

      buttons = [
      {url:"/#/trips/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/trips/edit/",title:"Edit Record",icon:"fa fa-edit"}
      ];
      $scope.title = "TRIP TICKET";
      $scope.addUrl = "/#/trips/add";
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/trips");
    };
    $scope.formInit = function(){
      var id = $routeParams.id;
      var action = $routeParams.action;
      var statusSales = Library.Status.Sales;
      var statusConsignments = Library.Status.Consignments;
      $scope.inventory_locations = Api.Collection('customers',query).query();
      $scope.ListChange = function(){
        $scope.trip.list = [];
        if($scope.trip.inventory_location){
          console.log("contrip",   statusConsignments.delivery.approved.status_code);
          var query = {
            "inventory_location":$scope.trip.inventory_location,
            "status.status_code" : {"$in" : [
            statusSales.order.rescheduled.status_code,
            statusSales.invoice.approved.status_code,
            statusSales.payment.updated.status_code,
            statusSales.printed.dr.status_code,
            statusSales.printed.si.status_code
            ]}
          };

          Api.Collection('sales',query).query().$promise.then(function(data){
              console.log(data);
            for(var i in data){
              if(data[i].customer){
                $scope.trip.list.push({
                  id : data[i]._id,
                  drno : data[i].drno,
                  customer : data[i].customer.company_name,
                  shipping_address :
                  data[i].customer.shipping_address.landmark + ', ' +
                  data[i].customer.shipping_address.barangay + ', ' +
                  data[i].customer.shipping_address.city + ', ' +
                  data[i].customer.shipping_address.province + ', ' +
                  data[i].customer.shipping_address.country + ', ' +
                  data[i].customer.shipping_address.zipcode,
                  received_by : "",
                  arrival_date : "",
                  departure : "",
                  status : ""

                });
              }
            }
          });

          query = {
              "consignment_transaction_type": "OUT",
              "inventory_location":$scope.trip.inventory_location,
              "status.status_code" : {"$in" : [
              statusConsignments.delivery.approved.status_code,
              ]}
          };

          Api.Collection('consignments',query).query().$promise.then(function(data){
              console.log(data);
            for(var i in data){
              if(data[i].customer){
                $scope.trip.list.push({
                  id : data[i]._id,
                  drno : data[i].drno,
                  customer : data[i].customer.company_name,
                  shipping_address :
                  data[i].customer.shipping_address.landmark + ', ' +
                  data[i].customer.shipping_address.barangay + ', ' +
                  data[i].customer.shipping_address.city + ', ' +
                  data[i].customer.shipping_address.province + ', ' +
                  data[i].customer.shipping_address.country + ', ' +
                  data[i].customer.shipping_address.zipcode,
                  received_by : "",
                  arrival_date : "",
                  departure : "",
                  status : ""

                });
              }
            }
          });

        }
      };

      $scope.action = action;
      if(id && action == 'read'){
        $scope.title = "VIEW TRIP TICKET " + id;
        $scope.trip =  Api.Collection('trips').get({id:$routeParams.id});
      }

      if(id && action == 'edit'){
        $scope.title = "EDIT TRIP TICKET " + id;
        $scope.trip =  Api.Collection('trips').get({id:$routeParams.id});

        $scope.saveTrip = function(){
          async.each($scope.trip.list, function( item, callback) {
            Api.Collection('sales').get({id : item.id}).$promise.then(function(sales){
              if(sales.pfno || sales.sono){
                var allowed_status = [
                statusSales.order.rescheduled.status_code,
                statusSales.invoice.approved.status_code,
                statusSales.payment.updated.status_code,
                statusSales.printed.dr.status_code,
                statusSales.printed.si.status_code
                ];
                if(item.status == "delivered"){
                  console.log("status: delivered");

                  if(allowed_status.indexOf(sales.status.status_code) != -1){
                    sales.status = statusSales.tripticket.delivered;
                  }
                }
                else if(item.status == "failed"){
                  console.log("status: failed");


                  if(allowed_status.indexOf(sales.status.status_code) != -1){
                    sales.status = statusSales.tripticket.failed;
                  }
                }
                $scope.trip.status = statusSales.tripticket.delivered;
                sales.trpno =  $scope.trip.trpno;
                sales.$update(function(){
                  callback();
                });
              }
            });
          },function(err){
            if(err){
              console.log(err);
            }
          });
          async.each($scope.trip.list, function( item, callback) {
            Api.Collection('consignments').get({id : item.id}).$promise.then(function(consignment){
              console.log("consignment",consignment);
              if(consignment.cono){
                var allowed_status =[
                statusSales.order.rescheduled.status_code,
                statusSales.invoice.approved.status_code,
                statusSales.payment.updated.status_code,
                statusSales.printed.dr.status_code,
                statusSales.printed.si.status_code
                ];
                if(item.status == "delivered"){
                  console.log("cono delivered");
                  if(allowed_status.indexOf(consignment.status.status_code) != -1){
                    consignment.status = statusConsignments.tripticket.delivered;
                  }
                }
                else if(item.status == "failed"){
                  console.log("cono failed");
                  if(allowed_status.indexOf(consignment.status.status_code) != -1){
                    consignment.status = statusConsignments.tripticket.failed;
                  }
                }

                consignment.trpno =  $scope.trip.trpno;
                consignment.$update(function(){
                  callback();
                });
              }
            });
          },function(err){
            if(err){
              console.log(err);
            }
          });
          $scope.trip.status = statusConsignments.tripticket.delivered;
          // $scope.trip.status = statusConsignments.tripticket.delivered;
          $scope.trip.$update(function(){
            $location.path('/trips/index');
            return false;
          });
        }

        $scope.deleteTrip=function(trip){
          if(popupService.showPopup('You are about to delete Record : '+trip._id)){
            $scope.trip.$delete(function(){
              $location.path('/trips/index');
              return false;
            });
          }
        };
        $scope.removeItem = function(index){
          console.log("deleting trip item");
          $scope.trip.list.splice(index, 1);
        };
      }

      if(action == 'add'){
        $scope.title = "ADD TRIP TICKET";
        var Trip = Api.Collection('trips');
        $scope.trip = new Trip();
        $scope.saveTrip = function(){
          $scope.trip.status = statusSales.tripticket.created;
          $scope.trip.$save(function(){
            async.each($scope.trip.list, function( item, callback) {
              Api.Collection('sales').get({id : item.id}).$promise.then(function(sales){
                sales.status = statusSales.tripticket.created;
                sales.trpno =  $scope.trip.trpno;
                sales.$update(function(){
                  callback();
                });
              });
            },function(err){
              if(err){
                console.log(err);
              }
            });
            $location.path('/trips/index');
            return false;
          });
          async.each($scope.trip.list, function( item, callback) {
            Api.Collection('consignments').get({id : item.id}).$promise.then(function(consignment){
              if(item.status == "delivered"){
                consignment.status = statusConsignments.tripticket.delivered;
                $scope.trip.status = statusConsignments.tripticket.delivered;
              }
              else if(item.status == "failed"){
                consignment.status = statusConsignments.tripticket.failed;
                $scope.trip.status = statusConsignments.tripticket.failed;
              }

              consignment.trpno =  $scope.trip.trpno;
              consignment.$update(function(){
                callback();
              });
            });
          },function(err){
            if(err){
              console.log(err);
            }
          });
      }
        $scope.removeItem = function(index){
          console.log("deleting trip item");
          $scope.trip.list.splice(index, 1);
        };
      }//end add
    }//end forminit
  });
})
.controller('DeliveryReceiptCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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

    $scope.title = "APPROVE DELIVERY RECEIPT - Ref.No.: "+ id;
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
.controller('SalesInvoiceCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });
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
    $scope.title = "APPROVE SALES INVOICE - Ref.No.: "+ id;
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
.controller('SalesPaymentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
  $scope.proceedPayment ='false';

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
  var otherFeesChange = 0;
   $scope.OtherFeesChange = function(){
    if (!$scope.sales.other_fees) { $scope.sales.other_fees = null; }
    otherFeesChange =1;
    PrintTotalPayment();
    console.log("other fees change");
  }

  var PrintTotalPayment = function() {
    $scope.sales.total_payment = 0;
    if($scope.sales.payment_details){
      for(var i=0;i<$scope.sales.payment_details.length; i++){
        $scope.sales.total_payment+=$scope.sales.payment_details[i].amount;
      }
    }
    if (otherFeesChange == 1) {
    $scope.sales.total_payment += Number($scope.sales.other_fees);
      console.log($scope.sales.total_payment + $scope.sales.other_fees);
    }
    if ($scope.sales.total_payment >= $scope.sales.total_amount_due){$scope.proceedPayment ='true';}
    else $scope.proceedPayment ='false';
    if ($scope.sales.cmno) {
      console.log("total change");
      $scope.sales.credit_memo = $scope.sales.total_payment - $scope.sales.total_amount_due;
      }
  }


  $scope.addPayment = function(sales){
    var payment = angular.copy(sales.payment_detail);
    if(payment && payment.payment_type && payment.amount){
        if($scope.sales.payment_details){
          $scope.sales.payment_details.push(payment);
        }
        else{
          $scope.sales.payment_details = [payment];
        }
    }
    payment = {};
    delete sales.payment_detail;
    PrintTotalPayment();
  }

  $scope.removePayment = function(index){
    $scope.sales.payment_details.splice(index, 1);
    PrintTotalPayment();
  }

  if(action == 'read'){
    $scope.title = "VIEW SALES PAYMENT";
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id}, function(){
      $scope.CustomerChange();
    });
  }

  // $scope.TotalPaymentChange = function(){
  //   console.log("change credit memo");
  // }

  if(action == 'update'){
    $scope.title = "UPDATE SALES PAYMENT  - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
      PrintTotalPayment();
    });
    $scope.saveSales = function(){
      if ($scope.sales.status.status_code == status.proforma.revised.status_code || $scope.sales.status.status_code == status.payment.rejected.status_code ) {
        console.log("proforma partialed");
        $scope.sales.status = status.payment.partialed;
      }
      else {
        console.log("payment updated");
        $scope.sales.status = status.payment.updated;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };
  }

  if(action == 'create'){
    $scope.title = "CREATE SALES PAYMENT - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
    if (!$scope.sales.total_amount_due) {
    $scope.proceedPayment ='true';
    console.log("there is no total amount due");
    }
        $scope.CustomerChange();
        if ($scope.sales.cmno) {
        $scope.sales.credit_memo = $scope.sales.total_payment - $scope.sales.total_amount_due;
        }
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.payment.created;
      console.log("payment created");
      if($scope.sales.pfno){
        $scope.sales.status = status.payment.partialed;
      }
      else{
        $scope.sales.status = status.payment.created;
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
      });
    };
  }
  if(action == 'approve'){
    $scope.proceedPayment='true';
    console.log($scope.proceedPayment);
    $scope.title = "APPROVE SALES PAYMENT - Ref.No.: "+ id;
    $scope.sales =  Api.Collection('sales').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveSales = function(){
      $scope.sales.status = status.payment.confirmed;
      $scope.sales.payment_date = new Date();
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };

    $scope.rejectPayment = function(){
      console.log("payment rejected");
      $scope.sales.status = status.payment.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/payment');
        return false;
      });
    };

  }

})
.controller('SalesReturnCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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
      $scope.sales.customer.discount.replace(" %","")/100 || 0,
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
      $scope.sales.customer.discount.replace(" %","")/100 || 0,
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
    $scope.title = "CREATE RETURN MERCHANDISE RECEIPT  - Ref.No.: "+ id;
    $scope.saveSales = function(){
      if ($scope.sales.rmrno) {
      $scope.sales.status = status.returned.revised;
      console.log("return revised");
      }
      else {
      $scope.sales.status = status.returned.created;
      console.log("return created");
      }
      $scope.sales.$update(function(){
        $location.path('/sales/index/return');
        return false;
      });
    };
  }

  if(action == 'approve'){
    console.log("return approve not returnApprove");
    $scope.title = "CREATE RETURN MERCHANDISE RECEIPT  - Ref.No.: "+ id;
    $scope.saveSales = function(){
      $scope.sales.status = status.returned.approved;
      $scope.sales.$update(function(){
        $location.path('/sales/index/approveReturn');
        return false;
      });
    };
    $scope.rejectSales = function(){
      $scope.sales.status = status.returned.rejected;
      $scope.sales.$update(function(){
        $location.path('/sales/index/approveReturn');
        return false;
      });
    };
  }
})
.controller('SalesMemoCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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

    $scope.title = "APPROVE CREDIT MEMO - Ref.No.: "+ id;
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
      console.log("memo rejected");
      $scope.sales.status = status.memo.rejected;
      $scope.sales.$update(function(){
        console.log("rejected memo");
        $location.path('/sales/index/memo');
        return false;
      });
    };
  }
})
.controller('ConsignCtrl', function ($scope, $window, $filter, $routeParams, $location, Structure, Library, Session, Api) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Consignments.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var status = Library.Status.Consignments;
    var columns = [];
    var buttons = [];
    var query = {};

    $scope.init = function(){
      var type = $routeParams.type;
      switch(type){
         case "order" :
            columns = [
              $scope.structure.cono,$scope.structure.consignment_transaction_type,
              $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/consignment/order/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/consignment/order/edit/",title:"Edit Record",icon:"fa fa-edit"},
              {url:"/#/consignment/order/reschedule/",title:"Reschedule Record",icon:"fa fa-truck", state:{statusArray:["TRIP_TICKET_FAILED"]}},
            ];

            query = { "status.status_code" : {"$in" : [
                status.order.created.status_code,
                status.order.revised.status_code,
                status.delivery.rejected.status_code,
                status.order.rejected.status_code,
                status.order.rescheduled.status_code,
                status.order.update.status_code,
                ]}};
            $scope.title = "CONSIGNMENT ORDERS";
            $scope.addUrl = "/#/consignment/order/add";

            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "approval" :
            columns = [
              $scope.structure.cono,$scope.structure.consignment_transaction_type,
              $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
            ];

            buttons = [
              {url:"/#/consignment/order/read/",title:"View Record",icon:"fa fa-folder-open"},
              {url:"/#/consignment/order/approve/",title:"Approve Record",icon:"fa fa-gear"}
            ];
            query = { "status.status_code" : {"$in" : [
                status.order.created.status_code,
                status.order.revised.status_code,
                status.order.rescheduled.status_code,
                status.order.update.status_code,
                ]}};
            $scope.title = "CONSIGNMENT ORDERS FOR APPROVAL";
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));
        break;
        case "delivery" :
          console.log("delivering");
          columns = [
            $scope.structure.cono,$scope.structure.consignment_transaction_type,
            $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
          ];
          buttons = [
          {url:"/#/consignment/delivery/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/consignment/delivery/approve/",title:"Approve Record",icon:"fa fa-gear"}
          ];
          query = { "status.status_code" : {"$in" : [
            status.packing.created.status_code,
              ]}};
          $scope.title = "CONSIGNMENT ORDERS FOR APPROVAL"

          $scope.dtColumns = Library.DataTable.columns(columns,buttons);
          $scope.dtOptions = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));


          var columns1 = [
          $scope.structure.cdrno,$scope.structure.cono,$scope.structure.consignment_transaction_type,
          $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name,
          ];

          var buttons1 = [
          {url:"/#/consignment/delivery/read/",title:"View Record",icon:"fa fa-folder-open"}
          ];

          query = { "status.status_code" : {"$in" : [status.delivery.approved.status_code]}};
          $scope.title1 = "APPROVED CONSIGNMENT DELIVERY RECEIPTS";

          $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
          $scope.dtOptions1 = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));

        break;
        case "packing":
            console.log("pack!");
            columns = [
            $scope.structure.cono, $scope.structure.consignment_transaction_type,
            $scope.structure.customer.company_name,$scope.structure.delivery_date,$scope.structure.status.status_name
            ];

            buttons = [
            {url:"/#/consignment/packing/read/",title:"View Record",icon:"fa fa-folder-open"},
            {url:"/#/consignment/packing/approve/",title:"View Record",icon:"fa fa-gear"}
            ];
            query = { "status.status_code" : {"$in" : [
              status.order.approved.status_code,
              ]}};

            $scope.title = "CONSIGNMENTS PACKING"
            $scope.dtColumns = Library.DataTable.columns(columns,buttons);
            $scope.dtOptions = Library.DataTable.options("/api/consignments?filter="+encodeURIComponent(JSON.stringify(query)));
        break;
        }
    }

  });
})
.controller('ConsignOrderCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {
var type = $routeParams.type;
  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
    $scope.consignment_transaction_types = Api.Collection('consignment_transaction_types').query();
    $scope.price_types = Api.Collection('price_types').query();
    $scope.order_sources = Api.Collection('order_sources').query();
    $scope.delivery_methods = Api.Collection('delivery_methods').query();
    $scope.customers = Api.Collection('customers').query();
    var query = {"type":"Retail"};
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var status = Library.Status.Consignments;

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
    var no_inventory_location = false;
    var item = angular.copy(consignments.item);
    if( item && item.name && item.quantity){
      console.log("with quantity", item);
      var isInventoryExist = false;
      var insufficient_item = [];
      for(var i in item.inventories){
        if(item.inventories[i]._id == $scope.consignments.inventory_location && $scope.consignments.item.quantity <= item.inventories[i].rquantity){
          isInventoryExist = true;
        }
      }
      if(isInventoryExist){
        if(consignments.customer.price_type == "Professional"){
          item.price = item.professional_price
          console.log("item.price: pro",item.price);
        }
        if(consignments.customer.price_type == "Retail"){
          item.price = item.retail_price;
          console.log("item.price retail: ",item.price);
        }
        if(!isNaN(item.price)){
          item.total = item.quantity * item.price;
        }
        delete item.inventories;
        if($scope.consignments.consigned_items){
          $scope.consignments.consigned_items.push(item);
        }
        else{
          $scope.consignments.consigned_items = [item];
        }
        delete consignments.item;
      }
      else{
        window.alert("The stock is insufficient. Please check your inventory location.");
      }

    }
      $scope.consignments.subtotal = 0;
      for(var i=0;i<$scope.consignments.consigned_items.length; i++){
        console.log("subtotal", $scope.consignments.subtotal );
        $scope.consignments.subtotal+=$scope.consignments.consigned_items[i].total;
      }

      console.log("final subtotal:",$scope.consignments.subtotal);
       var computation = Library.Compute.Order(
          $scope.consignments.subtotal,
          0,
          $scope.consignments.customer.discount.replace(" %","")/100 || 0,
          $scope.consignments.isWithholdingTax,
          $scope.consignments.isZeroRateSales
       );
       $scope.consignments.discount = computation.totalDiscount;
       $scope.consignments.total_vat = computation.vatableSales;
       $scope.consignments.total_amount_due = computation.totalAmountDue;
       $scope.consignments.zero_rate_sales = computation.zeroRatedSales;
       $scope.consignments.withholding_tax = computation.withholdingTax;
       console.log("vat:", $scope.consignments.discount);
       console.log("total_vat:", $scope.consignments.total_vat);
       console.log("total_amount_due:", $scope.consignments.total_amount_due);
       console.log("zero_rate_sales:", $scope.consignments.zero_rate_sales);
       console.log("withholding_tax:", $scope.consignments.withholding_tax);
    }


    $scope.reCompute = function(consignments){

      if($scope.consignments.customer){
        console.log($scope.consignments.subtotal,
          0,
          $scope.consignments.customer.discount.replace(" %","")/100 || 0,
          $scope.consignments.isWithholdingTax,
          $scope.consignments.isZeroRateSales);

        var computation = Library.Compute.Order(
          $scope.consignments.subtotal,
          0,
          $scope.consignments.customer.discount.replace(" %","")/100 || 0,
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
      $scope.consignments.consigned_items.splice(index, 1);
      $scope.consignments.subtotal = 0;
      for(var i=0;i<$scope.consignments.consigned_items.length; i++){
        $scope.consignments.subtotal+=$scope.consignments.consigned_items[i].total;
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
          $scope.consignments.status = status.order.created;
          //    $scope.sales.triggerInventory  = "OUT";
        $scope.consignments.$save(function(){
          $location.path('/consignment/index/order');
          return false;
        });
      }
    }
    if( id && action == 'edit'){

      $scope.title = "EDIT CONSIGNED ORDER - Ref.No.: "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveConsignments = function(){
          $scope.consignments.status = status.order.revised;
       $scope.consignments.$update(function(){
          $location.path('/consignment/index/order');
          return false;
        });
      };
      $scope.deleteConsignments=function(consignments){
        if(popupService.showPopup('You are about to delete Record : '+consignments._id)){
          $scope.consignments.$delete(function(){
            $location.path('/consignment/index/order');
            return false;
          });
        }
      };
    }
     if( id && action == 'reschedule'){

      $scope.title = "EDIT CONSIGNED ORDER - Ref.No.: "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveConsignments = function(){
          $scope.consignments.status = status.order.rescheduled;
       $scope.consignments.$update(function(){
          $location.path('/consignment/index/order');
          return false;
        });
      };
      $scope.deleteConsignments=function(consignments){
        if(popupService.showPopup('You are about to delete Record : '+consignments._id)){
          $scope.consignments.$delete(function(){
            $location.path('/consignment/index/order');
            return false;
          });
        }
      };
    }

  if(id && action == 'approve'){
      $scope.title = "APPROVE CONSIGNED ORDER - Ref.No.: "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });

      $scope.saveConsignments = function(){
      $scope.consignments.status = status.order.approved;
      $scope.consignments.$update(function(){
          $location.path('/consignment/index/approval');
          return false;
        });
      };
    $scope.rejectConsignments = function(){
      $scope.consignments.status = status.order.rejected;
      $scope.consignments.$update(function(){
        $location.path('/consignment/index/approval');
        return false;
      });
    };

  };

})
.controller('ConsignDeliveryCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;

  $scope.formInit = function(){
  var query = {"type":"Retail"};
  $scope.customers = Api.Collection('customers',query).query();
  $scope.inventory_locations = Api.Collection('customers',query).query();
  $scope.consignments = Api.Collection('consignments').query();
  var status = Library.Status.Consignments;

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

  if(action == 'read'){
    $scope.title = "VIEW CONSIGNMENT DELIVERY RECEIPT";
    $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
  }

  if(action == 'approve'){
    $scope.title = "APPROVE DELIVERY RECEIPT - Ref.No.: "+ id;
    $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
    });
    $scope.saveConsignments = function(){
      $scope.consignments.status = status.delivery.approved;
      $scope.consignments.$update(function(){
        $location.path('/consignment/index/delivery');
        return false;
      });
    };
    $scope.rejectConsignments = function(){
      $scope.consignments.status = status.delivery.rejected;
      $scope.consignments.$update(function(){
        $location.path('/consignment/index/delivery');
        return false;
      });
    };
  }

}
})
.controller('ConsignPackingCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  console.log("pack");
  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;
  var status = Library.Status.Consignments;
  var query = {};


  $scope.formInit = function(){
    var query = {"type":"Retail"};
    $scope.inventory_locations = Api.Collection('customers',query).query();

    if(action == 'read'){
      $scope.title = "VIEW PACKING " + id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id});
    }

    if(action == 'approve'){
      $scope.title = "APPROVE PACKING - Ref.No.: "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id});

      $scope.savePacking = function(){
        $scope.consignments.status = status.packing.created;
        $scope.consignments.$update(function(){
          $location.path('/consignment/index/packing');
          return false;
        });
      };
    }
  } //form init end

})
.controller('ConsignApprovalCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {
  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  var id = $routeParams.id;
  var action = $routeParams.action;
  $scope.action = action;

  $scope.formInit = function(){
    var query = {"type":"Retail"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.consignments = Api.Collection('consignments').query();
    var status = Library.Status.Consignments;

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

    if(action == 'read'){
      $scope.title = "VIEW CONSIGNMENT ORDER";
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
    }

    if(action == 'approve'){
      $scope.title = "APPROVE CONSIGNMENT  - Ref.No.: "+ id;
      $scope.consignments =  Api.Collection('consignments').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveConsignments = function(){
        $scope.consignments.status = status.order.approved;
        $scope.consignments.$update(function(){
          $location.path('/consignment/index/approval');
          return false;
        });
      };
      $scope.rejectConsignments = function(){
        $scope.consignments.status = status.order.rejected;
        $scope.consignments.$update(function(){
          $location.path('/consignment/index/approval');
          return false;
        });
      };
    }
  }
})
.controller('CDSCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.CDS.query().$promise.then(function(data){
  $scope.structure = data[0];
  $scope.ajax_ready = true;
  var columns = [];
  var buttons = [];
  var query = {};


    $scope.init = function(){
      columns = [
       $scope.structure.cdsno, $scope.structure.bl_consultant,  $scope.structure.sales_date
        ];

      buttons = [
        {url:"/#/cds/read/",title:"View Record",icon:"fa fa-folder-open"},
        {url:"/#/cds/approve/",title:"Approve Record",icon:"fa fa-gear"}
      ];
      // query = { "status.status_code" : {"$in" : [status.created.status_code]}};
      query= {};
      $scope.title = "CONSIGNMENT DAILY SALES"
      $scope.addUrl = "/#/cds/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/cds?filter="+encodeURIComponent(JSON.stringify(query)));
    }

  $scope.formInit = function(){
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
    var status = Library.Status.CDS;

    $scope.customers = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var query = {"type":"Retail"};
    $scope.inventory_locations = Api.Collection('customers',query).query();
    var query = {"position":"Sales Executive"};
    $scope.sales_executives = Api.Collection('users',query).query();


  if(action == 'read'){
    $scope.title = "VIEW CONSIGNMENT DELIVERY RECEIPT";
    $scope.cds =  Api.Collection('cds').get({id:$routeParams.id},function(){
    console.log("reading" + $scope.cds.sales_executive);
    });
  }
  if(action == 'add'){
  console.log("adding cds");
    $scope.title = "ADD CONSIGNMENT DAILY SALE";
    var cds = Api.Collection('cds');
    $scope.cds = new cds();

    $scope.saveCDS = function(){
        console.log("saved");
      $scope.cds.$save(function(){
        $location.path('/cds/index');
        return false;
      });
    $scope.cds.status = status.created;
    }
  }//end action add

  $scope.addCDS = function(cds){
    var item = angular.copy(cds.consigned_item);
    if (item && item.name && item.quantity){
      if($scope.cds.consigned_items){
        $scope.cds.consigned_items.push(item);
      }
      else{
        $scope.cds.consigned_items = [item];
      }
    }
      cds.consigned_item = null;
      cds.consigned_item.quantity = null;
      cds.consigned_item.refno = null;
      console.log("cds: "+cds);
    }
      $scope.removeCDS = function(index){
      $scope.cds.consigned_items.splice(index, 1);
    }

    if(action == 'approve'){
      $scope.title = "APPROVE CONSIGNMENT DAILY SALES  - Ref.No.: "+ id;
      $scope.cds =  Api.Collection('cds').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveCds = function(){
        $scope.cds.status = status.cds.approved;
        $scope.cds.$update(function(){
          $location.path('/cds/index');
          return false;
        });
      };
    }

  }
  });
})
.controller('MemoCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService, fileUpload) {

  Session.get(function(client) {
    if(Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Memo.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    $scope.title = "";
    var columns = [];
    var buttons = [];
    var query = {};

    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;

    // var temp_users = [];
    // $scope.memo_users = Api.Collection('users').query();
    // console.log("memo_users", $scope.memo_users);
    // var user = $scope.memo_users;
    // for (var i = 0; i < user.length; i++) {
    // console.log("user", user[i]);
    // }
    $scope.init = function(){
      columns = [
      $scope.structure.code, $scope.structure.subject,  $scope.structure.issue_date
      ];

      buttons = [
      {url:"/#/memo/view/",title:"View Memo",icon:"fa fa-folder-open"},
      {url:"/#/memo/download/",title:"Download Memo",icon:"fa fa-cloud-download"},
      {url:"/#/memo/confirmations/",title:"Check Confirmations",icon:"fa fa-gear"}
      ];
      $scope.title = "MEMORANDUM";
      // query = {}{ },{$limit(2)}};
      $scope.addUrl = "/#/memo/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/memorandum?filter="+encodeURIComponent(JSON.stringify(query)));
    }
  });

  // $scope.memorandum =  Api.Collection('memorandum').get({id:id},function(){
  //   if (action == 'download') {
  //     for(var i in memorandum.confirmation){
  //
  //     }
  //   }
  //   if (action == 'view') {
  //   }
  //   $scope.sales.$update(function(){
  //     $window.location.href = '/print/sales/'+type+'/'+id;
  //   });
  // });
// $scope.client = client;
// console.log(client);

// $scope.client = Session.get(function(client) {});
// console.log($scope.client);

  $scope.uploadFile = function(){
    console.log("users",$scope.memo.users);
    var memo_pdf = $scope.memo.file;
    var uploadUrl = '/api/memo/upload';
    if($scope.memo.file.name && $scope.memo.code && $scope.memo.subject ){
      fileUpload.uploadFileToUrl('memo_file', memo_pdf, uploadUrl,function(err,data){
        $scope.inventories = data;
      });
      $scope.memo.issue_date =new Date();
      $scope.memo.$save(function(){
        $location.path('/memo/index');
        return false;
      });
    }
  };

  $scope.formInit = function(){
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.id = id;
    $scope.action = action;

    if (action=='add') {
      $scope.title = "ANNOUNCE A MEMORANDUM";
      var Memorandum = Api.Collection('memorandum');
      $scope.memo = new Memorandum();

      Api.Collection('users').query().$promise.then(function(data){
        var users = [];
        for(var i in data){
          var temp = {};
          temp._id = data[i]._id;
          temp.fullname = data[i].fullname;
          temp.username = data[i].username;
          temp.position = data[i].position;
          users[i] = temp;
          // console.log("data",i," ",data[i]);
        }
        $scope.memo.users = users;
        // console.log("users",$scope.memo.users);
      });
    }
    if (action=='confirmations') {
      $scope.memo =  Api.Collection('memorandum').get({id:$routeParams.id},function(){});
      $scope.title = "MEMORANDUM "+ id;
    }
  }
})
.controller('AdjustmentCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

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

    $scope.price_types = Api.Collection('price_types').query();
    $scope.adjustment_transaction_types = Api.Collection('consignment_transaction_types').query();
    var query = {"type":"Retail"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var status = Library.Status.Adjustment;

    $scope.init = function(){

      columns = [
      $scope.structure.adjno,$scope.structure.adjustment_transaction_type,$scope.structure.inventory_location,
      $scope.structure.status.status_name
      ];

      buttons = [
      {url:"/#/adjustment/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/adjustment/edit/",title:"Edit Record",icon:"fa fa-edit"},
      {url:"/#/adjustment/approve/",title:"Approve Record",icon:"fa fa-gear"}
      ];
      query = { "status.status_code" : {"$in" : [status.created.status_code, status.revised.status_code,]}};
      $scope.title = "ADJUSTMENT"
      $scope.addUrl = "/#/adjustment/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/adjustments?filter="+encodeURIComponent(JSON.stringify(query)));
    }
    $scope.addOrder = function(adjustments){
      var item = angular.copy(adjustments.item);
      if( item && item.name && item.quantity && item.quantity ){
        delete item.inventories;
        if($scope.adjustments.adjusted_items){
          $scope.adjustments.adjusted_items.push(item);
        }
        else{
          $scope.adjustments.adjusted_items = [item];
        }
        delete adjustments.item;
      }
    }
    $scope.removeOrder = function(index){
      $scope.adjustments.adjusted_items.splice(index, 1);
      $scope.adjustments.subtotal = 0;
      $scope.adjustments.isNeedApproval = false;
      for(var i=0;i<$scope.adjustments.adjusted_items.length; i++){
        $scope.adjustments.subtotal+=$scope.adjustments.adjusted_items[i].total;
        if($scope.adjustments.adjusted_items[i].override != "NORMAL"){
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
        $scope.adjustments.status = status.created;
        $scope.adjustments.$save(function(){
          $location.path('/adjustment/index/');
          return false;
        });
      }
    }

    if( id && action == 'edit'){
      $scope.title = "EDIT ADJUSTMENT ORDER - Ref.No.: "+ id;
      $scope.adjustments =  Api.Collection('adjustments').get({id:$routeParams.id},function(){
      });
      $scope.saveAdjustments = function(){
        $scope.adjustments.status = status.revised;
        $scope.adjustments.$update(function(){
          $location.path('/adjustment/index');
          return false;
        });
      };
      $scope.deleteAdjustments = function(adjustments){
        if(popupService.showPopup('You are about to delete Record : '+adjustments._id)){
          $scope.adjustments.$delete(function(){
            $location.path('/adjustment/index');
            return false;
          });
        }
      };
    }
    if(id && action == 'approve'){
      $scope.title = "APPROVE ADJUSTMENT ORDER - Ref.No.: "+ id;
      $scope.adjustments =  Api.Collection('adjustments').get({id:$routeParams.id},function(){
      });
      $scope.saveAdjustments = function(){
        $scope.adjustments.status = status.approved;
        $scope.adjustments.$update(function(){
          $location.path('/adjustment/index/');
          return false;
        });
      };
    }

  });
})
.controller('CalendarCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  if (!jQuery().fullCalendar) {
    return;
  }
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  var h = {};

  if ($('#calendar').parents(".portlet").width() <= 720) {
    $('#calendar').addClass("mobile");
    h = {
      left: 'title, prev, next',
      center: '',
      right: 'prev,next,month,agendaWeek'
    };
  } else {
    $('#calendar').removeClass("mobile");
    h = {
      left: 'title',
      center: '',
      right: 'prev,next,month,agendaWeek'
    };
  }

  var events = [];
  Api.Collection('schedules').query().$promise.then(function(data){
    for(var i in data){
      if(data[i] && data[i].customer){
        console.log(data[i]);
        if(data[i].status && data[i].status.status_code == "SCHEDULE_CREATED"){
          events.push({
            title: data[i].customer.company_name,
            start: new Date(data[i].startDate),
            backgroundColor: App.getLayoutColorCode('yellow'),
            url: '/#/schedule/read/'+data[i]._id,
          });
        }
        else{
          events.push({
            title: data[i].customer.company_name,
            start: new Date(data[i].startDate),
            backgroundColor: App.getLayoutColorCode('green'),
            url: '/#/schedule/read/'+data[i]._id,
          });
        }
      }
    }
    $('#calendar').fullCalendar('destroy'); // destroy the calendar
  $('#calendar').fullCalendar({ //re-initialize the calendar
    header: h,
    slotMinutes: 15,
    editable: true,
    droppable: false, // this allows things to be dropped onto the calendar !!!
    drop: function (date, allDay) { // this function is called when something is dropped

      // retrieve the dropped element's stored Event Object
      var originalEventObject = $(this).data('eventObject');
      // we need to copy it, so that multiple events don't have a reference to the same object
      var copiedEventObject = $.extend({}, originalEventObject);

      // assign it the date that was reported
      copiedEventObject.start = date;
      copiedEventObject.allDay = allDay;
      copiedEventObject.className = $(this).attr("data-class");

      // render the event on the calendar
      // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

      // is the "remove after drop" checkbox checked?
      if ($('#drop-remove').is(':checked')) {
        // if so, remove the element from the "Draggable Events" list
        $(this).remove();
      }
    },
    events: events
  });
  });



})
.controller('ScheduleCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Schedules.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    var status = Library.Status.Schedule
    $scope.init = function(){
        columns = [
         $scope.structure.schno,
         $scope.structure.schedule_type,
         $scope.structure.customer.company_name,
         $scope.structure.status.status_name,
          ];
        buttons = [
          {url:"/#/schedule/read/",title:"View Record",icon:"fa fa-folder-open"},
          {url:"/#/schedule/edit/",title:"Edit Record",icon:"fa fa-edit"},
          {url:"/#/schedule/approve/",title:"Approve Record",icon:"fa fa-gear"},
        ];
        query = { "status.status_code" : {"$in" : [status.created.status_code]}};
        $scope.title = "ADD SCHEDULE"
        $scope.addUrl = "/#/schedule/add/"
        $scope.dtColumns = Library.DataTable.columns(columns,buttons);
        $scope.dtOptions = Library.DataTable.options("/api/schedules?filter="+encodeURIComponent(JSON.stringify(query)));

        var columns1 = [
         $scope.structure.schno,
         $scope.structure.schedule_type,
         $scope.structure.customer.company_name,
         $scope.structure.status.status_name,
        ];
        var buttons1 = [
          {url:"/#/schedule/read/",title:"View Record",icon:"fa fa-folder-open"}
        ];
        query = { "status.status_code" : {"$in" : [status.approved.status_code,status.rejected.status_code]}};
        $scope.title1 = "SCHEDULE LIST"
        $scope.dtColumns1 = Library.DataTable.columns(columns1,buttons1);
        $scope.dtOptions1 = Library.DataTable.options("/api/schedules?filter="+encodeURIComponent(JSON.stringify(query)));
    }
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
    $scope.brands = Api.Collection('brands',query).query();
    $scope.schedule_types = Api.Collection('schedule_types',query).query();
    var query = {"type":"Professional"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.CustomerChange = function(){
    var query = {"position":"Educator"};
        $scope.educators = Api.Collection('users',query).query();
      if($scope.schedules.customer){
        $scope.shipping_address =
        $scope.schedules.customer.shipping_address.landmark + ', ' +
        $scope.schedules.customer.shipping_address.barangay + ', ' +
        $scope.schedules.customer.shipping_address.city + ', ' +
        $scope.schedules.customer.shipping_address.province + ', ' +
        $scope.schedules.customer.shipping_address.country + ', ' +
        $scope.schedules.customer.shipping_address.zipcode;
        $scope.billing_address =
        $scope.schedules.customer.billing_address.landmark + ', ' +
        $scope.schedules.customer.billing_address.barangay + ', ' +
        $scope.schedules.customer.billing_address.city + ', ' +
        $scope.schedules.customer.billing_address.province + ', ' +
        $scope.schedules.customer.billing_address.country + ', ' +
        $scope.schedules.customer.billing_address.zipcode;
      }
    }

    if(id && action == 'read'){
      $scope.title = "VIEW SCHEDULE";
      $scope.schedules =  Api.Collection('schedules').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
      });
    }
    if(action == 'add'){
      $scope.title = "ADD SCHEDULE";
      var Schedules = Api.Collection('schedules');
      $scope.schedules = new Schedules();

      $scope.saveSched = function(){
        $scope.schedules.status = status.created;
         //    $scope.sales.triggerInventory  = "OUT";
        $scope.schedules.$save(function(){
          $location.path('/schedule/index/');
          return false;
        });
      }
    };
    if( id && action == 'edit'){

      $scope.title = "EDIT SCHEDULE - Ref.No.: "+ id;
      $scope.schedules =  Api.Collection('schedules').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });
      $scope.saveSched = function(){
          $scope.schedules.status = status.update;
       $scope.schedules.$update(function(){
          $location.path('/schedule/index/');
          return false;
        });
      };
    };
    console.log(action);
    if(id && action == 'approve'){
      $scope.title = "APPROVE CONSIGNED ORDER - Ref.No.: "+ id;
      $scope.schedules =  Api.Collection('schedules').get({id:$routeParams.id},function(){
        $scope.CustomerChange();
      });

      $scope.saveSched = function(){
       $scope.schedules.status = status.approved;
        $scope.schedules.$update(function(){
          $location.path('/schedule/index');
          return false;
        });
      };
      $scope.rejectSched = function(){
        $scope.schedules.status = status.rejected;
          $scope.schedules.$update(function(){
        $location.path('/schedule/index');
        return false;
      });
    };

    };

  });

})
.controller('PrintCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });
  var type = $routeParams.type;
  var status = Library.Status.Sales;
  console.log("status: ", status);
  var id = $routeParams.id;
  var type = $routeParams.type;
  $scope.sales =  Api.Collection('sales').get({id:id},function(){
    if (type == 'delivery') {
      $scope.sales.status = status.printed.dr;
    }
    if (type == 'invoice') {
      $scope.sales.status = status.printed.si;
    }
    $scope.sales.$update(function(){
      $window.location.href = '/print/sales/'+type+'/'+id;
    });
  });

})
.controller('CycleCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Cycle.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};


    $scope.init = function(){
      columns = [
      $scope.structure.cycno, $scope.structure.date_start, $scope.structure.date_end, $scope.structure.status.status_name
      ];

      buttons = [
      {url:"/#/cycle/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/cycle/approve/",title:"Approve Record",icon:"fa fa-gear"}
      ];
      // query = { "status.status_code" : {"$in" : [status.created.status_code]}};
      query= {};
      $scope.title = "CYCLE COUNT"
      $scope.addUrl = "/#/cycle/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/cycle?filter="+encodeURIComponent(JSON.stringify(query)));
    };

    $scope.formInit =function(){
      var id = $routeParams.id;
      var action = $routeParams.action;
      $scope.action = action;
      $scope.products = Api.Collection('products').query();
      $scope.movement = Api.Collection('movements').query();
      var status = Library.Status.Cycle;

      if(action=='add'){
        $scope.title = "ADD CYCLE COUNT";
        var cycle = Api.Collection('cycle');
        $scope.cycle = new cycle();
        var query = {"movement":"C"};
        Api.Collection('products',query,2,100).query().$promise.then(function(data){
          var items = [];
          var location_stock = 0;
          for(var i in data){
            if(data[i].bl_code){
              for(var j in data[i].inventories){
                // console.log("inventories: "data[i].inventories[j]);
                if(data[i].inventories[j] && data[i].inventories[j].company_name == "Beautylane-Dasma"){
                  location_stock = data[i].inventories[j].quantity;
                  // console.log("location_stock: " location_stock);
                }
              }
              items.push({
                bl_code : data[i].bl_code,
                name : data[i].name,
                movement: data[i].movement,
                quantity : "",
                inventory : location_stock

              });
            }
          }
          $scope.cycle.counted_items = items;
        });

        $scope.saveCycle = function(){
          console.log("saved");
          $scope.cycle.$save(function(){
            $location.path('/cycle/index');
            return false;
          });
          $scope.cycle.status = status.created;
          console.log($scope.cycle.status);
        }
      }

      if(action == 'read'){
        $scope.title = "VIEW CYCLE COUNT" + id;
        $scope.cycle =  Api.Collection('cycle').get({id:$routeParams.id});
      }

      if(action == 'approve'){
        $scope.title = "APPROVE CYCLE COUNT" + id;
        $scope.cycle =  Api.Collection('cycle').get({id:$routeParams.id});

        $scope.saveCycle = function(){
          $scope.cycle.status = status.approved;
          $scope.cycle.$update(function(){
            console.log("cycle updated");
            $location.path('/cycle/index');
            return false;
          });
        };
      }
    }
  });
})
.controller('PromoCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Promo.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};


    $scope.init = function(){
      columns = [
      $scope.structure.promono, $scope.structure.name, $scope.structure.date_start, $scope.structure.date_end
      ];

      buttons = [
      {url:"/#/promo/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/promo/approve/",title:"Approve Record",icon:"fa fa-gear"}
      ];
      // query = { "status.status_code" : {"$in" : [status.created.status_code]}};
      query= {};
      $scope.title = "PROMO MAKER"
      $scope.addUrl = "/#/promo/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/promo?filter="+encodeURIComponent(JSON.stringify(query)));
    };

    $scope.formInit =function(){
      var id = $routeParams.id;
      var action = $routeParams.action;
      $scope.action = action;
      $scope.products = Api.Collection('products').query();
      $scope.brands = Api.Collection('brands').query();
      var status = Library.Status.Promo;

      if(action=='add'){
        $scope.title = "ADD PROMO";
        var Promo = Api.Collection('promo');
        $scope.promo = new Promo();
        $scope.discounts = Api.Collection('discounts').query();

        $scope.savePromo = function(){
          $scope.promo.status = status.created;
          console.log("saved");
          $scope.promo.$save(function(){
            $location.path('/promo/index');
            return false;
          });
        }
      }

      if(action == 'read'){
        $scope.title = "VIEW PROMO" + id;
        $scope.promo =  Api.Collection('promo').get({id:$routeParams.id});
      }

      if(action == 'approve'){
        $scope.title = "APPROVE PROMO" + id;
        $scope.promo =  Api.Collection('promo').get({id:$routeParams.id});

        $scope.savePromo = function(){
          $scope.promo.status = status.approved;
          $scope.promo.$update(function(){
            $location.path('/promo/index');
            return false;
          });
        };
        $scope.deletePromo=function(adjustments){
          if(popupService.showPopup('You are about to delete Record : '+adjustments._id)){
            $scope.promo.$delete(function(){
              $location.path('/promo/index');
              return false;
            });
          }
        };
      }

      $scope.addRequiredItem = function(promo){
        var item = angular.copy(promo.item);
        delete item.inventories;
        delete item.audit_history;
        if(item && item.name && item.quantity){
          if($scope.promo.required_items){
            $scope.promo.required_items.push(item);
          }
          else{
            $scope.promo.required_items = [item];
          }
        }

        delete promo.item;
      }
      $scope.removeRequiredItem = function(index){
        $scope.promo.required_items.splice(index, 1);
      }

      //freebie
      $scope.addFreebie = function(promo){
        var item = angular.copy(promo.freebie);
        delete item.inventories;
        delete item.audit_history;
        if(item && item.name && item.quantity){
          if($scope.promo.freebies){
            $scope.promo.freebies.push(item);
          }
          else{
            $scope.promo.freebies = [item];
          }
        }
        delete promo.freebie;
      }
      $scope.removeFreebie = function(index){
        $scope.promo.freebies.splice(index, 1);
      }

    } //form init end
  });
})
.controller('MergeCtrl', function ($scope,$window, $filter, $routeParams, $location, Structure, Library, Session, Api, popupService) {

  Session.get(function(client) {
    if(!Library.Permission.isAllowed(client,$location.path())){
      $location.path("/auth/unauthorized");
    }
  });

  $scope.ajax_ready = false;
  Structure.Merges.query().$promise.then(function(data){
    $scope.structure = data[0];
    $scope.ajax_ready = true;
    var columns = [];
    var buttons = [];
    var query = {};
    var status = Library.Status.Merge
    var id = $routeParams.id;
    var action = $routeParams.action;
    $scope.action = action;
    $scope.pm_types = Api.Collection('consignment_transaction_types').query();

    var query = {"type":"Retail"};
    $scope.customers = Api.Collection('customers',query).query();
    $scope.inventory_locations = Api.Collection('customers',query).query();
    $scope.products = Api.Collection('products').query();
    var status = Library.Status.Merge;

    $scope.init = function(){
      columns = [
         $scope.structure.pmno,
         $scope.structure.pm_type,
         $scope.structure.inventory_location,
         $scope.structure.status.status_name,
      ];

      buttons = [
      {url:"/#/merge/read/",title:"View Record",icon:"fa fa-folder-open"},
      {url:"/#/merge/approve/",title:"Approve Record",icon:"fa fa-gear"}
      ];
       query = { "status.status_code" : {"$in" : [status.created.status_code]}};
      query= {};
      $scope.title = "MERGE ITEM"
      $scope.addUrl = "/#/merge/add"
      $scope.dtColumns = Library.DataTable.columns(columns,buttons);
      $scope.dtOptions = Library.DataTable.options("/api/merges?filter="+encodeURIComponent(JSON.stringify(query)));
    };
     $scope.addItemIn = function(merges){
      var item = angular.copy(merges.item);
      if( item && item.name && item.quantity && item.quantity ){
        delete item.inventories;
        if($scope.merges.pm_item){
          $scope.merges.pm_item.push(item);
        }
        else{
          $scope.merges.pm_item = [item];
        }
        delete merges.item;
      }
     }
     $scope.addItemOut = function(merges){
      var item = angular.copy(merges.item);
      if( item && item.name && item.quantity && item.quantity ){
        delete item.inventories;
        if($scope.merges.unmerge_item){
          $scope.merges.unmerge_item.push(item);
        }
        else{
          $scope.merges.unmerge_item = [item];
        }
        delete merges.item;
      }
     }
     $scope.removeItemIn = function(index){
      $scope.merges.pm_item.splice(index, 1);
      $scope.merges.subtotal = 0;
      for(var i=0;i<$scope.merges.pm_item.length; i++){
        $scope.merges.subtotal+=$scope.merges.pm_item[i].total;
      }
    }
    $scope.removeItemOut = function(index){
      $scope.merges.unmerge_item.splice(index, 1);
      $scope.merges.subtotal = 0;
      for(var i=0;i<$scope.merges.unmerge_item.length; i++){
        $scope.merges.subtotal+=$scope.merges.unmerge_item[i].total;
      }
    }
    if( action == 'read'){
      $scope.title = "VIEW MERGE";
      $scope.merges =  Api.Collection('merges').get({id:$routeParams.id},function(){
      $scope.CustomerChange();
      });
    }
     if(action == 'add'){
      $scope.title = "ADD MERGE ITEMS";
      var Merges = Api.Collection('merges');
      $scope.merges = new Merges();

      $scope.saveMerge = function(){
      console.log('frank');
          $scope.merges.status = status.created;
          //    $scope.sales.triggerInventory  = "OUT";

        $scope.merges.$save(function(){
          $location.path('/merge/index/');
          return false;
        });
      }
    }


  });
});
