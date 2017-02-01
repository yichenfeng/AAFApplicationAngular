'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $state, $rootScope) {

var data = $scope.user;
$scope.submitForm = function(isValid) {

$scope.submitted = true;

if (( $scope.application.requestContent.assistanceRequested.fire || $scope.application.requestContent.assistanceRequested.other || $scope.application.requestContent.assistanceRequested.utilities||
  $scope.application.requestContent.assistanceRequested.disaster || $scope.application.requestContent.assistanceRequested.funeral || $scope.user.options) == true){
$state.go('other');
}


  };



});
