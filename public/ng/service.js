'use strict';

angular.module('erp')
  .factory('Reference', function ($resource) {
    return {
      Menu : $resource('/data/json/menu.json'),
      Sales : $resource('/data/structure/sales.json')
    }
  })
  .factory('Api', function ($resource) {
    return {
      Collection : function(table){
          return $resource('/api/'+table+'/:id',{id:'@_id'},{
            update: {
              method: 'PUT'
            },
            query: {
              method: 'GET',
              isArray: true
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
