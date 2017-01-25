'use strict';
angular.module('myApp').controller('IncidentInfoCtrl', function ($scope, $http, $state, DataService, $rootScope, $filter) {

  $scope.max = 1000;
  $scope.count = 0;
  $scope.isOpen = false;
  $scope.showErrorMessage = false;

  $scope.inlineOptions = {
    showWeeks: true
  };

  $scope.saveForLater = function () {
    $state.go('home');
  };

  $scope.dateChanged = function () {
    $scope.showErrorMessage = false;
    if ($rootScope.application) {
      var date = new Date(document.getElementById('date').value);
      $rootScope.application.request_content.updatedData = {
        'incident_date' : $filter('date')(date, 'MM/dd/yyyy')
      };
    }
  };

  $scope.next = function (event) {
    if ($scope.incidentInfoForm.$valid) {
      $state.go('assistanceRequest');
    } else {
      $scope.showErrorMessage = true;
      event.preventDefault();
    }
  };

});
