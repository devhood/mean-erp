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
      Sales : $resource('/data/structure/sales.json'),
      Users : $resource('/data/structure/users.json'),
      Customers : $resource('/data/structure/customers.json')
    }
  })
  .factory('Api', function ($resource) {
    return {
      Collection : function(table,query){
          var url = '/api/'+table+'/:id'
          if(query){
            url = '/api/'+table+'?filter='+encodeURIComponent(JSON.stringify(query));
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
  });
