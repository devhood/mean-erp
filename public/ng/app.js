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
      .when('/product/index', {
        templateUrl: '/partials/product/index',
        controller: 'ProductCtrl'
      })
      .when('/product/add', {
        templateUrl: '/partials/product/add',
        controller: 'ProductCtrl'
      })
      .when('/product/read', {
        templateUrl: '/partials/product/read',
        controller: 'ProductCtrl'
      })
      .when('/customer/index', {
        templateUrl: '/partials/customer/index',
        controller: 'CustomerCtrl'
      })
      .when('/customer/add', {
        templateUrl: '/partials/customer/add',
        controller: 'CustomerCtrl'
      })
      .when('/customer/read', {
        templateUrl: '/partials/customer/read',
        controller: 'CustomerCtrl'
      })
      .when('/user/index', {
        templateUrl: '/partials/user/index',
        controller: 'UserCtrl'
      })
      .when('/user/add', {
        templateUrl: '/partials/user/add',
        controller: 'UserCtrl'
      })
      .when('/user/:type/:id', {
        templateUrl: '/partials/user/add',
        controller: 'UserCtrl'
      })
      .when('/user/read', {
        templateUrl: '/partials/user/read',
        controller: 'UserCtrl'
      })
      .when('/sales/index', {
        templateUrl: '/partials/sales/index',
        controller: 'SalesCtrl'
      })
      .when('/sales/index/:type', {
        templateUrl: '/partials/sales/index',
        controller: 'SalesCtrl'
      })
      .when('/sales/order/:action', {
        templateUrl: '/partials/sales/order',
        controller: 'SalesCtrl'
      })
      .when('/sales/delivery/:action', {
        templateUrl: '/partials/sales/delivery',
        controller: 'SalesCtrl'
      })
      .when('/sales/invoice/:action', {
        templateUrl: '/partials/sales/invoice',
        controller: 'SalesCtrl'
      })
      .when('/sales/return/:action', {
        templateUrl: '/partials/sales/return',
        controller: 'SalesCtrl'
      })
      .when('/sales/memo/:action', {
        templateUrl: '/partials/sales/memo',
        controller: 'SalesCtrl'
      })
      .when('/sales/payment/:action', {
        templateUrl: '/partials/sales/payment',
        controller: 'SalesCtrl'
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
