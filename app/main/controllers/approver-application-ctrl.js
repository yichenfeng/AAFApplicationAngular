'use strict';
angular.module('myApp')
.controller('ApproverApplicationCtrl', function ($scope, $state, $stateParams, DataService, $rootScope) {
  if(!$stateParams.appId) {
    $state.go('approverHome', []);
  }
  DataService.getApplicationById($stateParams.appId).then(function (result) {
    console.log(result);
    if(result) {
      $scope.application = result;
    } else {
      //TODO: handle error
    }
  });

  $scope.return = function () {
    DataService.returnApplication($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
        $state.go('approverHome');
      }
    });
  };
});
