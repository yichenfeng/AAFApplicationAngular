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
});
