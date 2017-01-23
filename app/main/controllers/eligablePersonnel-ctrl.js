'use strict';
angular.module('myApp')
.controller('EligablePersonnelCtrl', function ($scope, $state, $rootScope) {

  $scope.saveForLater = function () {
    $state.go('home');
  };

  $scope.saveInfo = function() {
    if ($rootScope.application) { //application created
      var person = {};
      $scope.persons = [];
      if ($scope.fName1) {
        person = {
          'fName' : $scope.fName1,
          'initial' : $scope.initial1,
          'lName' : $scope.lName1,
          'age' : $scope.age1,
          'relationship' : $scope.relationship1,
        };
        $scope.persons.push(person);
      }
      if ($scope.fName2) {
        person = {
          'fName' : $scope.fName2,
          'initial' : $scope.initial2,
          'lName' : $scope.lName2,
          'age' : $scope.age2,
          'relationship' : $scope.relationship2,
        };
        $scope.persons.push(person);
      }
      if ($scope.fName3) {
        person = {
          'fName' : $scope.fName3,
          'initial' : $scope.initial3,
          'lName' : $scope.lName3,
          'age' : $scope.age3,
          'relationship' : $scope.relationship3,
        };
        $scope.persons.push(person);
      }
      if ($scope.fName4) {
        person = {
          'fName' : $scope.fName4,
          'initial' : $scope.initial4,
          'lName' : $scope.lName4,
          'age' : $scope.age4,
          'relationship' : $scope.relationship4,
        };
        $scope.persons.push(person);
      }
      if ($scope.fName5) {
        person = {
          'fName' : $scope.fName5,
          'initial' : $scope.initial5,
          'lName' : $scope.lName5,
          'age' : $scope.age5,
          'relationship' : $scope.relationship5,
        };
        $scope.persons.push(person);
      }
      if ($scope.persons.length > 0) {
        $rootScope.application.request_content.updatedData = $scope.persons;
      }
    }
  };

  $scope.next = function () {
    $scope.saveInfo();
    $state.go('incidentInfo');
  };

});
