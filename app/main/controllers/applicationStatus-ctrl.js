'use strict';
angular.module('myApp')
.controller('ApplicationStatusCtrl', function ($scope, $state, $rootScope) {

  $scope.status = 'Approval Status';
  $scope.isStep1Complete = false;
  $scope.isStep2Complete = false;
  $scope.isStep3Complete = false;

  $scope.$watch('application', function (newValue) {
    // newValue = undefined;
    // $rootScope.application = undefined;
    if (newValue) {
      // $rootScope.application.status = 'Submitted';
      if ($rootScope.application.status === 'Submitted') {
        $scope.isStep1Complete = true;
      } else if ($rootScope.application.status === 'Approver Pending') {
        $scope.isStep1Complete = true;
        $scope.isStep2Complete = true;
      } else if (($rootScope.application.status === 'Returned') || ($rootScope.application.status === 'Approved') ||
          ($rootScope.application.status === 'Denied') || ($rootScope.application.status === 'Completed')) {
        $scope.isStep1Complete = true;
        $scope.isStep2Complete = true;
        $scope.isStep3Complete = true;
        $scope.status = $rootScope.application.status;
      }
    }
  }, true);

});
