'use strict';
var app = angular.module('myApp')
    .directive('adminNavigation', function() {
      return {
        scope: {
          step: '@',
          appId: '='
        },
        templateUrl: 'main/templates/admin-navigation.html'
      };
  });
