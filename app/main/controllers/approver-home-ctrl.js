'use strict';
angular.module('myApp')
.controller('ApproverHomeCtrl', function ($scope, $state, $rootScope, DataService, NgTableParams) {

  $scope.statuses = [
    'Draft',
    'Submitted',
    'Approver Pending',
    'Returned',
    'Approved',
    'Denied',
    'Completed'
  ];

  $scope.viewApp = function (id) {
    $state.go('admin-application', { id : id });
  };

  DataService.getApplications().then(function (response) {
    $scope.applications = response;
    $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results });
  });

  $scope.search = function () {
    if ($scope.employeeID && $scope.status) {
      DataService.getApplicationsByEmployeeAndStatus($scope.employeeID, $scope.status).then(function (response) {
        $scope.applications = response;
        $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results });
      });
    } else if ($scope.employeeID) {
      DataService.getApplicationsForEmployee($scope.employeeID).then(function (response) {
        $scope.applications = response;
        $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results });
      });
    } else if ($scope.status) {
      DataService.getApplicationsByStatus($scope.status).then(function (response) {
        $scope.applications = response;
        $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results });
      });
    }

  };

});
