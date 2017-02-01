'use strict';
angular.module('myApp')
.controller('AdminApplicationCtrl', function ($scope, $state) {
  $scope.submit = function () {
    $state.go('home',[]);
  };
});
