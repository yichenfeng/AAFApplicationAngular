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
    if (( $scope.application.request_content.updatedData.user.fire || $scope.application.request_content.updatedData.user.other || $scope.application.request_content.updatedData.user.utilities ||
       $scope.user.options || $scope.application.request_content.updatedData.user.disaster || $scope.application.request_content.updatedData.user.funeral) == true){
      $state.go('other');
    }
  };
});
