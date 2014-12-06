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
        controller: 'SalesCtrl'
      })
      .when('/sales/payment/:action/:id', {
        templateUrl: '/partials/sales/payment',
        controller: 'SalesCtrl'
      })
<<<<<<< HEAD
      .when('/consignment/index', {
        templateUrl: '/partials/consignment/index',
        controller: 'ConsignmentCtrl'
      })
      .when('/consignment/:action', {
        templateUrl: '/partials/consignment/add',
        controller: 'ConsignmentCtrl'
      })
      .when('/consignment/:action/:id', {
        templateUrl: '/partials/consignment/add',
        controller: 'ConsignmentCtrl'
      })


=======
      .when('/shipment/index', {
        templateUrl: '/partials/shipment/index',
        controller: 'ShipmentCtrl'
      })
      .when('/shipment/:action', {
        templateUrl: '/partials/shipment/page',
        controller: 'ShipmentCtrl'
      })
      .when('/shipment/:action/:id', {
        templateUrl: '/partials/shipment/page',
        controller: 'ShipmentCtrl'
      })
      .when('/purchase/index', {
        templateUrl: '/partials/purchase/index',
        controller: 'PurchaseCtrl'
      })
      .when('/purchase/:action', {
        templateUrl: '/partials/purchase/page',
        controller: 'PurchaseCtrl'
      })
      .when('/purchase/:action/:id', {
        templateUrl: '/partials/purchase/page',
        controller: 'PurchaseCtrl'
      })
>>>>>>> c2e47f548d41e246ed47251a937dccdd0533689f
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
