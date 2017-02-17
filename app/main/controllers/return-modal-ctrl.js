'use strict';
angular.module('myApp')
.controller('ReturnModalCtrl', function ($scope, $uibModalInstance, comment) {

  $scope.comment = comment;

  $scope.ok = function (comment) {
    $uibModalInstance.close($scope.comment);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
