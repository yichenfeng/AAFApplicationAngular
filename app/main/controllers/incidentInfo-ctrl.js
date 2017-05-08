'use strict';
angular.module('myApp').controller('IncidentInfoCtrl', function ($scope, $http, $state, DataService, $rootScope, $filter, $stateParams) {

  var populateDate = function () {
    if ($rootScope.application.requestContent.incidentInfo.eventDate) {
      $scope.dt = new Date($rootScope.application.requestContent.incidentInfo.eventDate.$date);
    }
  };

  $scope.appId = '';
  if(!$stateParams.appId) {
    $state.go('applicationInformation', {});
  } else if(!$rootScope.application || $rootScope.application._id != $stateParams.appId) {
    DataService.getApplicationById($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
        populateDate();
      } else {
        //TODO: handle error
      }
    });
  } else {
    populateDate();
  }

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
      $rootScope.application.requestContent.incidentInfo.eventDate = { $date : date };
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
