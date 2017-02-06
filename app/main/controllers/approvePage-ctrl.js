'use strict';
angular.module('myApp')
.controller('ApprovePageCtrl', function ($scope, $state, $rootScope) {

    $scope.nextButton = function() {
        $state.go('review-submission');
    };

    $scope.saveFormBtn = function() {
        $state.go('home');
    };

    $scope.dateChanged = function () {
      $scope.showErrorMessage = false;
    //   if ($rootScope.application) {
    //     var date = new Date(document.getElementById('date').value);
    //     $rootScope.application.requestContent.incidentInfo = {
    //       'eventDate' : { $date : date }
    //     };
    //   }
    };
});
