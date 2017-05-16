'use strict';
angular.module('myApp')
.controller('ApproverHomeCtrl', function ($scope, $state, $rootScope, DataService, NgTableParams, $stateParams, $filter) {

  $scope.statuses = [
    'Submitted',
    'Returned',
    'Approved',
    'Denied'
  ];

  $scope.isExport = false;

  var loadResponse = function (response) {
    if ($scope.isExport) {
      var blob = new Blob([response], {type: "text/csv"});
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "Applications.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      $scope.applications = response;
      $scope.pages = Math.ceil(response.count/response.perPage);
      $scope.tableParams = new NgTableParams({}, { dataset: $scope.applications.results, counts: [] });
    }
    $scope.isExport = false;
  };

  var getApps = function (pageNumber) {
    DataService.getApplications(pageNumber, $scope.isExport).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByEmployee = function (pageNumber) {
    DataService.getApplicationsForEmployee($scope.employeeID, pageNumber, $scope.isExport).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByStatus = function (pageNumber) {
    DataService.getApplicationsByStatus($scope.status, pageNumber, $scope.isExport).then(function (response) {
      loadResponse(response);
    });
  };

  var searchByEmployeeAndStatus = function (pageNumber) {
    DataService.getApplicationsByEmployeeAndStatus($scope.employeeID, $scope.status, pageNumber, $scope.isExport).then(function (response) {
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
    $scope.isExport = false;
    $scope.applications.pageNum++;
    $scope.search();
  };

  $scope.prev = function () {
    $scope.isExport = false;
    $scope.applications.pageNum--;
    $scope.search();
  };

  $scope.jump = function () {
    $scope.isExport = false;
    $scope.applications.pageNum = $scope.jumpPage;
    $scope.search();
  };

  $scope.export = function () {
    $scope.isExport = true;
    if ($scope.employeeID && $scope.status) {
      searchByEmployeeAndStatus($scope.applications.pageNum);
    } else if ($scope.employeeID) {
      searchByEmployee($scope.applications.pageNum);
    } else if ($scope.status) {
      searchByStatus($scope.applications.pageNum);
    } else {
      getApps($scope.applications.pageNum);
    }
  };

});
