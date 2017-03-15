'use strict';
angular.module('myApp')
.controller('ApprovePageCtrl', function ($scope, $state, DataService, $rootScope, $stateParams) {

  var populateDate = function () {
    if ($rootScope.application.requestContent.reviewDetails.dateAwarded) {
      $scope.dt = new Date($rootScope.application.requestContent.reviewDetails.dateAwarded.$date);
    }
  };

  angular.element(document).ready(function () {
    DataService.getAdminList().then(function (result) {
      $scope.adminList = result;
    });
  });

  $scope.appId = '';
  if(!$stateParams.appId) {
    $state.go('applicationInformation', {});
  } else if(!$rootScope.application || $rootScope.application._id != $stateParams.appId) {
    DataService.getApplicationById($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
        console.log($rootScope.application);
        populateDate();
      } else {
        //TODO: handle error
      }
    });
  } else {
    populateDate();
  }

  $scope.dateChanged = function () {
    if ($rootScope.application) {
      var date = new Date(document.getElementById('date').value);
      $rootScope.application.requestContent.reviewDetails.dateAwarded = { $date : date };
    }
  };

  $scope.approve = function (event) {
    $scope.submitted = true;
    if ($scope.approveForm.$valid) {
      // $rootScope.application.requestContent.reviewDetails.review = 'approve';
      DataService.approveApplication($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
          $state.go('approverHome');
        }
      });
    } else {
      event.preventDefault();
    }
  };

});
