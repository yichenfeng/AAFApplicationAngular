'use strict';
angular.module('myApp')
.controller('AttachmentsCtrl', function ($scope, $state, $rootScope, DataService) {

    $scope.nextButton = function() {
        $state.go('review-submission');
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
                      console.log('Updated attachments:');
                      //For now, let's do it this way; this means we'll need a save button on each page, but converting it to be event-driven or watching the form adds a lot more complexity that we're not yet ready for.
                    } else {
                        console.log('Error Updating Attachments');
                      //Todo: handle the error state
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
