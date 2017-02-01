'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $state, $rootScope) {

var data = $scope.user;
$scope.submitForm = function(isValid) {

$scope.submitted = true;

if (( $scope.application.requestContent.updatedData.user.fire || $scope.application.requestContent.updatedData.user.other || $scope.application.requestContent.updatedData.user.utilities ||
   $scope.user.options || $scope.application.requestContent.updatedData.user.disaster || $scope.application.requestContent.updatedData.user.funeral) == true){
$state.go('other');
}

  };



});
