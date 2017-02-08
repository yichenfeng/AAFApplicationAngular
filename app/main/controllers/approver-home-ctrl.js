'use strict';
angular.module('myApp')
.controller('ApproverHomeCtrl', function ($scope, $state, $rootScope, DataService, NgTableParams, $stateParams, $filter) {

  $scope.statuses = [
    'Submitted',
    'Returned',
    'Approved',
    'Denied'
  ];

  $scope.viewApp = function (id) {
    // will need to change once admin review page is done
    $state.go('applicationInformation', { appId : id });
  };

  var loadTable = function () {
    DataService.getApplications().then(function (response) {
      $scope.applications = response;
      $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results });
    });
  };

  angular.element(document).ready(function () {
    loadTable();
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
