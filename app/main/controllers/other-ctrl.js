'use strict';
angular.module('myApp')
.controller('OtherCtrl', function ($scope, $state, $rootScope, DataService, $stateParams) {
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

    $scope.nextButton = function() {
        $state.go('review-submission')
    };

    $scope.saveLaterBtn = function() {
        $state.go('home');
    };

});
