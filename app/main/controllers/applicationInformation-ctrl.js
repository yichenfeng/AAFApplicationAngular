'use strict';
angular.module('myApp')
.controller('ApplicationInformationCtrl', function ($scope, $state, $rootScope, $stateParams, DataService, $location) {
  if($stateParams.appId === null) {
    $rootScope.createApplication().then(function (result) {
      $location.path('applicationInformation/' + $rootScope.application._id);
    });
  } else if((!$rootScope.application || $rootScope.application._id != $stateParams.appId) && ($stateParams.appId)) {
    DataService.getApplicationById($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
      } else {
        //TODO: handle error
      }
    });
  }

  $scope.noWrapSlides = false;
  $scope.active = 0;

  $scope.saveForLater = function() {
    $state.go('home');
  };

  $scope.next = function (event) {
    $scope.submitted = true;
    if ($scope.applicationInfoForm.$valid) {
      $state.go('eligiblePersonnel', {appId: $scope.application._id});
    } else {
      event.preventDefault();
      if ($scope.showBehalfError !== false) {
        $scope.showBehalfError = true;
      }
      if ($scope.showJobTypeError !== false) {
        $scope.showJobTypeError = true;
      }
      if ($scope.showPermAddressError !== false) {
        $scope.showPermAddressError = true;
      }
    }
  };

  $scope.states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

});
