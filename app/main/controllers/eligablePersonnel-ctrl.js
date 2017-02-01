'use strict';
angular.module('myApp')
.controller('EligablePersonnelCtrl', function ($scope, $state, $rootScope) {

  var createPersonnel = function () {
    var persons = [];
    var row = 0;
    for (var i=0; i<5; i++) {
      row++;
      var person = {
        'row' : row,
        'fName' : '',
        'initial' : '',
        'lName' : '',
        'age' : 0,
        'relationship' : ''
      };
      persons.push(person);
    }
    return persons;
  };

  $scope.$watch('application', function (newValue) {
    if (newValue) {
      if ($rootScope.application.requestContent.eligiblePersonnel.length > 0) {
         $scope.persons = $rootScope.application.requestContent.eligiblePersonnel;
      } else {
        $scope.persons = createPersonnel();
      }
    }
  });

  $scope.saveForLater = function () {
    $state.go('home');
  };

  $scope.$watch('persons', function (newValue) {
    if ($rootScope.application) {
      $rootScope.application.requestContent.eligiblePersonnel = newValue;
    }
  }, true);

  $scope.next = function () {
    $state.go('incidentInfo');
  };

});
