'use strict';
angular.module('myApp')
.controller('ApplicationInformationCtrl', function ($scope, $state, $rootScope) {

  $scope.showBehalfError = false;
  $scope.showPermAddressError = false;
  $scope.showJobTypeError = false;
  var isBehalfSelected = false;
  var isPermAddressSelected = false;
  var isJobTypeSelected = false;

  $scope.behalfSelected = function () {
    isBehalfSelected = true;
    $scope.showBehalfError = false;
  };

  $scope.permAddressSelected = function () {
    isPermAddressSelected = true;
    $scope.showPermAddressError = false;
  };

  $scope.jobTypeSelected = function () {
    isJobTypeSelected = true;
    $scope.showJobTypeError = false;
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
      if (!isBehalfSelected) {
        $scope.showBehalfError = true;
      }
      if (!isPermAddressSelected) {
        $scope.showPermAddressError = true;
      }
      if (!isJobTypeSelected) {
        $scope.showJobTypeError = true;
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
