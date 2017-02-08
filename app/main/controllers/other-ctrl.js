'use strict';
angular.module('myApp')
.controller('OtherCtrl', function ($scope, $state, $rootScope, DataService, $stateParams) {

  $scope.nextButton = function() {
        $state.go('review-submission', {appId: $rootScope.application._id});
    };

    $scope.saveLaterBtn = function() {
        $state.go('home');
    };

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
