'use strict';

angular.module('erp')
  .service('popupService',function($window){
    this.showPopup=function(message){
      return $window.confirm(message);
    }
  })
  .factory('Reference', function ($resource) {
    return {
      Menu : $resource('/data/json/menu.json')
    }
  })
  .factory('Structure', function ($resource) {
    return {
      Adjustments : $resource('/data/structure/adjustments.json'),
      ProdMerges : $resource('/data/structure/prodmerges.json'),
      Sales : $resource('/data/structure/sales.json'),
      Consignments : $resource('/data/structure/consignments.json'),
      Users : $resource('/data/structure/users.json'),
      Customers : $resource('/data/structure/customers.json'),
      Products : $resource('/data/structure/products.json'),
      Packing : $resource('/data/structure/packing.json'),
      Shipments : $resource('/data/structure/shipments.json'),
      Purchases : $resource('/data/structure/purchases.json'),
      Trips : $resource('/data/structure/trips.json'),
      Schedules : $resource('/data/structure/schedules.json'),
      CDS : $resource('/data/structure/cds.json'),
      Cycle : $resource('/data/structure/cycle.json')
    }
  })
  .factory('Api', function ($resource) {
    return {
      Collection : function(table,query,page,rows){
          var url = '/api/'+table+'/:id'
          if(query){
            url = '/api/'+table+'?&filter='+encodeURIComponent(JSON.stringify(query));
          }
          if(page && rows && query){
            url = '/api/'+table+'?page='+page+'&rows='+rows+'&filter='+encodeURIComponent(JSON.stringify(query));
          }
          return $resource(url,{id:'@_id'},{
            update: {
              method: 'PUT'
            }
          });
      }
    }
  })
  .factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
          method:'PUT'
        },
        'query': {
          method: 'GET',
          isArray: true
        }
      });
  })
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  })
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {
      currentUser: function() {
        Session.get(function(user) {
          $rootScope.currentUser = user;
        });
      },
      logout: function(callback) {
        var cb = callback || angular.noop;
        Session.delete(function(res) {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

    };
  }).service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(key,file, uploadUrl){
      var fd = new FormData();
      fd.append(key, file);
      $http.put(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(){
      })
      .error(function(){
      });
    }
  }]).directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]);
