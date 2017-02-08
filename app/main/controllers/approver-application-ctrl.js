'use strict';
angular.module('myApp')
.controller('ApproverApplicationCtrl', function ($scope, $state, $stateParams, DataService, $rootScope, $uibModal) {

  if(!$stateParams.appId) {
    $state.go('approverHome', []);
  }
  DataService.getApplicationById($stateParams.appId).then(function (result) {
    if(result) {
      $rootScope.application = result;
    } else {
      //TODO: handle error
    }
  });

  $scope.open = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'applicationReturnedModal.html',
      controller: 'ReturnModalCtrl',
      resolve: {
        comment: function () {
          return $scope.comment;
        }
      }
    });

    modalInstance.result.then(function (comment) {
      $rootScope.application.requestContent.reviewDetails.comments = comment;
      DataService.returnApplication($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
          console.log($rootScope.application);
          $state.go('approverHome');
        }
      });
    });
  };

  $scope.return = function () {
    $scope.open();
  };
});
