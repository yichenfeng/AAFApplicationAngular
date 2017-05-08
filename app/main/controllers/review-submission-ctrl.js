'use strict';
 angular.module('myApp')
.controller('ReviewSubmissionCtrl', function ($scope, $state, DataService, $document, $uibModal, $rootScope, $filter, SignaturePad, $stateParams) {

  var populateDate = function () {
    if ($rootScope.application.requestContent.submitDetails.submitDate) {
      $scope.dt = new Date($rootScope.application.requestContent.submitDetails.submitDate.$date);
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

  var $ctrl = this;
  $ctrl.animationsEnabled = true;
  $scope.max = 1000;
  $scope.count = 0;
  $scope.isOpen = false;

  $scope.submit = function(isValid) {
    $scope.submitted = true;
    if(($rootScope.application.requestContent.submitDetails.signature !== undefined) && (isValid === true)) {
      DataService.submitApplication($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
          $state.go('home');
        }
      });
    } else if (isValid === false) {
      console.log("Valid Check failed");
    } else {
      $ctrl.open();
    }
  };

  $scope.dateChanged = function () {
    $scope.showErrorMessage = false;
    if ($rootScope.application) {
      var date = new Date(document.getElementById('reviewDate').value);
      $rootScope.application.requestContent.submitDetails.submitDate = { $date : date };
    }
  };

  $scope.inlineOptions = {
    showWeeks: true
  };

});
