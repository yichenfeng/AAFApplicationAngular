'use strict';
angular.module('myApp').directive('limitWords', [
  function() {
    return function(scope, element, attrs) {
      element.bind('keyup', function() {
        scope.count = this.value.split(' ').length;
        if (scope.count > scope.max) {
          this.maxLength = this.value.length;
        }
      });
    };
  }
]);
