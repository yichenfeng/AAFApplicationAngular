'use strict';
angular.module('myApp')
.controller('ApproverHomeCtrl', function ($scope, $state, $rootScope, DataService, NgTableParams, $stateParams, $filter) {

  $scope.statuses = [
    'Submitted',
    'Returned',
    'Approved',
    'Denied'
  ];

  var loadResponse = function (response) {
    $scope.applications = response;
    $scope.pages = Math.ceil(response.count/response.perPage);
    $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results, counts: [] });
  };

  var getApps = function (pageNumber) {
    DataService.getApplications(pageNumber).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByEmployee = function (pageNumber) {
    DataService.getApplicationsForEmployee($scope.employeeID, pageNumber).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByStatus = function (pageNumber) {
    DataService.getApplicationsByStatus($scope.status, pageNumber).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByEmployeeAndStatus = function (pageNumber) {
    DataService.getApplicationsByEmployeeAndStatus($scope.employeeID, $scope.status, pageNumber).then(function (response) {
      loadResponse(response);
    });
  };

  var loadTable = function () {
    getApps(1);
  };

  angular.element(document).ready(function () {
    loadTable();
  });

  $scope.search = function () {
    var pageNumber = 1;
    if ($scope.applications.pageNum) {
      console.log($scope.applications.pageNum);
      pageNumber = $scope.applications.pageNum;
    }
    if ($scope.employeeID && $scope.status) {
      searchByEmployeeAndStatus(pageNumber);
    } else if ($scope.employeeID) {
      searchByEmployee(pageNumber);
    } else if ($scope.status) {
      searchByStatus(pageNumber);
    } else {
      getApps(pageNumber);
    }
  };

  $scope.next = function () {
    $scope.applications.pageNum++;
    $scope.search();
  };

  $scope.prev = function () {
    $scope.applications.pageNum--;
    $scope.search();
  };

  $scope.jump = function () {
    $scope.applications.pageNum = $scope.jumpPage;
    $scope.search();
  };

});
