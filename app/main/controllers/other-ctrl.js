'use strict';
angular.module('myApp')
.controller('OtherCtrl', function ($scope, $state, $rootScope) {

    $scope.nextButton = function() {
        $state.go('review-submission')
    };

    $scope.saveLaterBtn = function() {
        $state.go('home');
    };
});
