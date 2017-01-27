'use strict';
angular.module('myApp')
.controller('ApplicationStatusCtrl', function ($scope, $state, $rootScope) {

  $scope.statusEnum = {
    'Created' : 0,
    'Submitted' : 1,
    'Pending' : 2,
    'Returned' : 3,
    'Approved' : 4,
    'Denied' : 5,
    'Completed' : 6
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
      if ($scope.step > $scope.statusEnum.Pending) {
        $scope.status = $rootScope.application.status;
      }
    }
  }, true);

});
