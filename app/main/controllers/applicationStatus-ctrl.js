'use strict';
angular.module('myApp')
.controller('ApplicationStatusCtrl', function ($scope, $state, $rootScope) {

  $scope.statusEnum = {
    'Draft' : 0,
    'Submitted' : 1,
    'Returned' : 2,
    'Approved' : 3,
    'Denied' : 4
  };

  $scope.status = 'Approval Status';

  $scope.$watch('application', function (newValue) {
    if (newValue) {
      angular.forEach($scope.statusEnum, function (value, key) {
        if (newValue.status === key) {
          $scope.step = value;
          return;
        }
      });
      if ($scope.step > $scope.statusEnum.Returned) {
        $scope.status = $rootScope.application.status;
      }
    }
  }, true);

});
