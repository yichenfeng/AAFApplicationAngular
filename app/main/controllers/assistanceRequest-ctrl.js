'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $state, $rootScope, $stateParams, DataService) {
  if(!$stateParams.appId) {
    $state.go('applicationInformation', {});
  } else if(!$rootScope.application || $rootScope.application._id != $stateParams.appId) {
    DataService.getApplicationById($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
      } else {
        //TODO: handle error
      }
    });
  }



var data = $scope.user;
$scope.submitForm = function(isValid) {

$scope.submitted = true;

if (( $scope.application.requestContent.assistanceRequested.fire || $scope.application.requestContent.assistanceRequested.other || $scope.application.requestContent.assistanceRequested.utilities||
  $scope.application.requestContent.assistanceRequested.naturalDisaster || $scope.application.requestContent.assistanceRequested.funeral || $scope.user.options) == true){
  $state.go('other',{appId:$rootScope.application._id});
}


  };


});
