'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $http, $state, DataService, $rootScope) {

var data = $scope.user;
$scope.submitForm = function(isValid) {

$scope.submitted = true;
// console.log($scope.user);

if ($rootScope.application) { //application created
  $rootScope.application.request_content.updatedData = {
     'requested_amount' : $scope.user.amount,
     'requested_shelter' : $scope.user.shelter,
     'requested_funeral' : $scope.user.funeral,
     'requested_utilities' : $scope.user.utilities,
     'requested_fire' : $scope.user.fire,
     'requested_natural_disaster' : $scope.disaster,
     'requested_other' : $scope.user.other
  };

  DataService.updateApplication($rootScope.application).then(function(result) {
    if(result) {
      var updatedApplication = result;
      console.log('Updated data:');
      //For now, let's do it this way; this means we'll need a save button on each page, but converting it to be event-driven or watching the form adds a lot more complexity that we're not yet ready for.
    } else {
      //Todo: handle the error state
      console.log('Did not update');
    }
  });
}

if (( $scope.user.options || $scope.user.fire || $scope.user.other || $scope.user.utilities || $scope.user.disaster || $scope.user.funeral) == true){
$state.go('other');
}

  };



});
