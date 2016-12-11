'use strict';
angular.module('myApp')
.controller('LoginCtrl', function ($scope, $state) {

  $scope.submit = function () {

$state.go('home',[]);
  };


});
