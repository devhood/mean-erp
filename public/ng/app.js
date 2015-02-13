'use strict';

angular.module('erp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.bootstrap',
  'ui.utils',
  'datatables'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home/index',
        controller: 'MainCtrl'
      })
      .when('/auth/logout',{
        templateUrl: '/partials/home/index',
        controller: 'MainCtrl'
      })
      .when('/user/index', {
        templateUrl: '/partials/user/index',
        controller: 'UserCtrl'
      })
      .when('/user/:action', {
        templateUrl: '/partials/user/add',
        controller: 'UserCtrl'
      })
      .when('/user/:action/:id', {
        templateUrl: '/partials/user/add',
        controller: 'UserCtrl'
      })
      .when('/customer/index', {
        templateUrl: '/partials/customer/index',
        controller: 'CustomerCtrl'
      })
      .when('/customer/:action', {
        templateUrl: '/partials/customer/add',
        controller: 'CustomerCtrl'
      })
      .when('/customer/:action/:id', {
        templateUrl: '/partials/customer/add',
        controller: 'CustomerCtrl'
      })
      .when('/product/index', {
        templateUrl: '/partials/product/index',
        controller: 'ProductCtrl'
      })
      .when('/product/:action', {
        templateUrl: '/partials/product/add',
        controller: 'ProductCtrl'
      })
      .when('/product/:action/:id', {
        templateUrl: '/partials/product/add',
        controller: 'ProductCtrl'
      })
      .when('/monitor/products', {
        templateUrl: '/partials/monitor/products',
        controller: 'MonitorCtrl'
      })
      .when('/monitor/customers', {
        templateUrl: '/partials/monitor/customers',
        controller: 'MonitorCtrl'
      })
      .when('/monitor/duplicate', {
        templateUrl: '/partials/monitor/duplicate',
        controller: 'MonitorCtrl'
      })
      .when('/packing/index', {
        templateUrl: '/partials/packing/index',
        controller: 'PackingCtrl'
      })
      .when('/packing/:action', {
        templateUrl: '/partials/packing/add',
        controller: 'PackingCtrl'
      })
      .when('/packing/:action/:id', {
        templateUrl: '/partials/packing/add',
        controller: 'PackingCtrl'
      })
      .when('/trips/index', {
        templateUrl: '/partials/trips/index',
        controller: 'TripsCtrl'
      })
      .when('/trips/:action', {
        templateUrl: '/partials/trips/add',
        controller: 'TripsCtrl'
      })
      .when('/trips/:action/:id', {
        templateUrl: '/partials/trips/add',
        controller: 'TripsCtrl'
      })
      .when('/sales/index/:type', {
        templateUrl: '/partials/sales/index',
        controller: 'SalesCtrl'
      })
      .when('/sales/order/:action', {
        templateUrl: '/partials/sales/order',
        controller: 'SalesOrderCtrl'
      })
      .when('/sales/order/:action/:id', {
        templateUrl: '/partials/sales/order',
        controller: 'SalesOrderCtrl'
      })
      .when('/sales/delivery/:action/:id', {
        templateUrl: '/partials/sales/delivery',
        controller: 'DeliveryReceiptCtrl'
      })
      .when('/sales/delivery/:action', {
        templateUrl: '/partials/sales/delivery',
        controller: 'DeliveryReceiptCtrl'
      })
      .when('/sales/invoice/:action/:id', {
        templateUrl: '/partials/sales/invoice',
        controller: 'SalesInvoiceCtrl'
      })
      .when('/sales/proforma/:action', {
        templateUrl: '/partials/sales/proforma',
        controller: 'SalesProformaCtrl'
      })
      .when('/sales/proforma/:action/:id', {
        templateUrl: '/partials/sales/proforma',
        controller: 'SalesProformaCtrl'
      })
      .when('/sales/promo/:action', {
        templateUrl: '/partials/sales/promo',
        controller: 'SalesPromoCtrl'
      })
      .when('/sales/promo/:action/:id', {
        templateUrl: '/partials/sales/promo',
        controller: 'SalesPromoCtrl'
      })
      .when('/sales/return/:action/:id', {
        templateUrl: '/partials/sales/return',
        controller: 'SalesReturnCtrl'
      })
      .when('/sales/memo/:action/:id', {
        templateUrl: '/partials/sales/memo',
        controller: 'SalesMemoCtrl'
      })
      .when('/sales/payment/:action', {
        templateUrl: '/partials/sales/payment',
        controller: 'SalesPaymentCtrl'
      })
      .when('/sales/payment/:action/:id', {
        templateUrl: '/partials/sales/payment',
        controller: 'SalesPaymentCtrl'
      })
      .when('/consignment/index/:type', {
        templateUrl: '/partials/consignment/index',
        controller: 'ConsignCtrl'
      })
      .when('/consignment/order/:action', {
        templateUrl: '/partials/consignment/order',
        controller: 'ConsignOrderCtrl'
      })
      .when('/consignment/order/:action/:id', {
        templateUrl: '/partials/consignment/order',
        controller: 'ConsignOrderCtrl'
      })
      .when('/consignment/delivery/:action', {
        templateUrl: '/partials/consignment/delivery',
        controller: 'ConsignDeliveryCtrl'
      })
      .when('/consignment/delivery/:action/:id', {
        templateUrl: '/partials/consignment/delivery',
        controller: 'ConsignDeliveryCtrl'
      })
      .when('/consignment/approval/:action', {
        templateUrl: '/partials/consignment/approval',
        controller: 'ConsignApprovalCtrl'
      })
      .when('/consignment/approval/:action/:id', {
        templateUrl: '/partials/consignment/approval',
        controller: 'ConsignApprovalCtrl'
      })
      .when('/consignment/packing/:action', {
        templateUrl: '/partials/consignment/packing',
        controller: 'ConsignPackingCtrl'
      })
      .when('/consignment/packing/:action/:id', {
        templateUrl: '/partials/consignment/packing',
        controller: 'ConsignPackingCtrl'
      })
      .when('/cds/index', {
        templateUrl: '/partials/cds/index',
        controller: 'CDSCtrl'
      })
      .when('/cds/:action', {
        templateUrl: '/partials/cds/add',
        controller: 'CDSCtrl'
      })
      .when('/cds/:action/:id', {
        templateUrl: '/partials/cds/add',
        controller: 'CDSCtrl'
      })
      .when('/memo/index', {
        templateUrl: '/partials/memo/index',
        controller: 'MemoCtrl'
      })
      .when('/memo/:action', {
        templateUrl: '/partials/memo/add',
        controller: 'MemoCtrl'
      })
      .when('/memo/:action/:id', {
        templateUrl: '/partials/memo/add',
        controller: 'MemoCtrl'
      })
      .when('/shipment/index/:type', {
        templateUrl: '/partials/shipment/index',
        controller: 'ShipmentCtrl'
      })
      .when('/shipment/:action', {
        templateUrl: '/partials/shipment/add',
        controller: 'ShipmentCtrl'
      })
      .when('/shipment/:action/:id', {
        templateUrl: '/partials/shipment/add',
        controller: 'ShipmentCtrl'
      })
      .when('/purchase/index', {
        templateUrl: '/partials/purchase/index',
        controller: 'PurchaseCtrl'
      })
      .when('/purchase/:action', {
        templateUrl: '/partials/purchase/add',
        controller: 'PurchaseCtrl'
      })
      .when('/purchase/:action/:id', {
        templateUrl: '/partials/purchase/add',
        controller: 'PurchaseCtrl'
      })
      .when('/adjustment/index', {
        templateUrl: '/partials/adjustment/index',
        controller: 'AdjustmentCtrl'
      })
      .when('/adjustment/:action', {
        templateUrl: '/partials/adjustment/add',
        controller: 'AdjustmentCtrl'
      })
      .when('/adjustment/:action/:id', {
        templateUrl: '/partials/adjustment/add',
        controller: 'AdjustmentCtrl'
      })
      .when('/calendar/index', {
        templateUrl: '/partials/calendar/index',
        controller: 'CalendarCtrl'
      })
      .when('/calendar/:action', {
        templateUrl: '/partials/calendar/add',
        controller: 'CalendarCtrl'
      })
      .when('/cycle/index', {
        templateUrl: '/partials/cycle/index',
        controller: 'CycleCtrl'
      })
      .when('/cycle/:action', {
        templateUrl: '/partials/cycle/add',
        controller: 'CycleCtrl'
      })
      .when('/cycle/:action/:id', {
        templateUrl: '/partials/cycle/add',
        controller: 'CycleCtrl'
      })
      .when('/promo/index', {
        templateUrl: '/partials/promo/index',
        controller: 'PromoCtrl'
      })
      .when('/promo/:action', {
        templateUrl: '/partials/promo/add',
        controller: 'PromoCtrl'
      })
      .when('/promo/:action/:id', {
        templateUrl: '/partials/promo/add',
        controller: 'PromoCtrl'
      })
      .when('/print/sales/:type/:id', {
        templateUrl: '/partials/sales/index',
        controller: 'PrintCtrl'
      })
      .when('/reports/:module/:type', {
        templateUrl: '/partials/sales/reports',
        controller: 'ReportCtrl'
      })
      .when('/reports/:module/:type/:id', {
        templateUrl: '/partials/sales/record',
        controller: 'ReportCtrl'
      })
      .when('/schedule/index', {
        templateUrl: '/partials/schedule/index',
        controller: 'ScheduleCtrl'
      })
      .when('/schedule/:action', {
        templateUrl: '/partials/schedule/add',
        controller: 'ScheduleCtrl'
      })
      .when('/schedule/:action/:id', {
        templateUrl: '/partials/schedule/add',
        controller: 'ScheduleCtrl'
      })
      .when('/merge/index', {
        templateUrl: '/partials/merge/index',
        controller: 'MergeCtrl'
      })
      .when('/merge/:action', {
        templateUrl: '/partials/merge/add',
        controller: 'MergeCtrl'
      })
      .when('/merge/:action/:id', {
        templateUrl: '/partials/merge/add',
        controller: 'MergeCtrl'
      })
      .when('/upload/inventories', {
        templateUrl: '/partials/upload/inventories',
        controller: 'UploadInventoriesCtrl'
      })
      .when('/upload/prices', {
        templateUrl: '/partials/upload/prices',
        controller: 'UploadPricesCtrl'
      })
      .when('/auth/unauthorized', {
        templateUrl: '/partials/home/unauthorized',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  })

  .run(function ($window,$rootScope, $location, Auth) {

    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {

      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/auth/login', '/auth/logout'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $window.location.href = '/auth/login';
    });
  });
