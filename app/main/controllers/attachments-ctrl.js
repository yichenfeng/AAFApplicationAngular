'use strict';
angular.module('myApp')
.controller('AttachmentsCtrl', function ($scope, $state, $rootScope, DataService) {

    $scope.nextButton = function() {
        $state.go('review-submission', {appId: $rootScope.application._id});
    };

    $scope.saveLaterBtn = function() {
        $state.go('home');
    };

    $scope.name = '';
    $scope.files = [];

    $scope.$watch('files', function(newValue) {
        console.log(newValue);
        if(newValue) {
            if($rootScope.application) {
                DataService.updateAttachments($scope.files, $rootScope.application._id).then(function(result) {
                    if(result) {
                      var updatedAttachments = result;
                    } else {
                      $scope.error = true;
                    }
                });
            }
        }
    }, true);

    $scope.deleteAttachment = function(index) {
        $scope.files.splice(index, 1);
    };

    $scope.addURL = function() {
        $scope.files.push({fileName:$scope.urlLink, description: "", base64String: "" });
    };

    $scope.atMax = function() {
        if ($scope.files.length > 20)
            return true;
    };
});
