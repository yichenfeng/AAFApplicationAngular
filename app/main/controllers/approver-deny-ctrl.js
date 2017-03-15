'use strict';
angular.module('myApp')
.controller('ApproverDenyCtrl', function ($scope, $state, DataService, $rootScope, $stateParams) {
  $scope.appId = '';
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

  $scope.reasons = ['Does not qualify', 'Lack of documentation', 'Other'];

  angular.element(document).ready(function () {
    DataService.getAdminList().then(function (result) {
      $scope.adminList = result;
    });
  });

  $scope.deny = function (event) {
    $scope.submitted = true;
    if ($scope.denyForm.$valid) {
      if ($rootScope.application.requestContent.reviewDetails.denialReason === 'Other') {
        $rootScope.application.requestContent.reviewDetails.denialReason = document.getElementById('otherReason').value;
      }
      // $rootScope.application.requestContent.reviewDetails.review = 'deny';
      DataService.denyApplication($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
          $state.go('approverHome');
        }
      });
    } else {
      event.preventDefault();
    }
  };

});
