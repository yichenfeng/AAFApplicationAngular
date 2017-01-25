'use strict';
angular.module('myApp')
.controller('ApplicationInformationCtrl', function ($scope, $state, $rootScope) {

  $scope.changeBehalf = function () {
    $scope.showBehalfError = false;
  };

  $scope.changeJobType = function () {
    $scope.showJobTypeError = false;
  };

  $scope.changePermAddress = function () {
    $scope.showPermAddressError = false;
  };

  $scope.saveForLater = function() {
    $state.go('home');
  };

  $scope.next = function (event) {
    $scope.submitted = true;
    if ($scope.applicationInfoForm.$valid) {
      $state.go('eligiblePersonnel');
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
