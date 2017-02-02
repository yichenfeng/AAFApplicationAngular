'use strict';
var app = angular.module('myApp')
    .directive('sideNavigation', function() {
      return {
        scope: {
          step: '@',
          appId: '='
        },
        templateUrl: 'main/templates/navigation.html'
      };
  });
