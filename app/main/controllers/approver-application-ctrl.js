'use strict';
angular.module('myApp')
.controller('ApproverApplicationCtrl', function ($scope, $state, $stateParams, DataService) {
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
});
