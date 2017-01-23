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
        'age' : '',
        'relationship' : ''
      };
      persons.push(person);
    }
    return persons;
  };

  if($rootScope.application) {
    if ($rootScope.application.request_content.updatedData.eligible_personnel) {
       $scope.persons = $rootScope.application.request_content.updatedData.eligible_personnel;
    }
  } else {
    $scope.persons = createPersonnel();
  }

  $scope.saveForLater = function () {
    $state.go('home');
  };

  $scope.$watch('persons', function (newValue) {
    if ($rootScope.application) {
      if ($rootScope.application.request_content.updatedData) {
        $rootScope.application.request_content.updatedData.eligible_personnel = newValue;
      } else {
        $rootScope.application.request_content.updatedData = {
            'eligible_personnel' : newValue
        };
      }
    }
  }, true);

  $scope.next = function () {
    $state.go('incidentInfo');
  };

});
