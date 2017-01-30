'use strict';
angular.module('myApp')
.controller('AttachmentsCtrl', function ($scope, $state, $rootScope) {
    // $scope.uploadFile = function() {
    //     var file = $scope.myFile;
    //     console.log('file is ');
    //     console.dir(file);
    //     console.log('Upload button pressed');
    //     var uploadUrl = "/fileUpload";
    //     fileUpload.uploadFileToUrl(file, uploadUrl);
    // };

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
            if($rootScope.application)
            $rootScope.application.documentation = $scope.files;
        }
    }, true);

    $scope.deleteAttachment = function(index) {
        $scope.files.splice(index, 1);
        console.log('Delete Button Pressed');
    };

    $scope.addURL = function() {
        $scope.files.push({name:$scope.urlLink});
        console.log('ADD Link Button Pressed');
        console.log($scope.files);
    };

    $scope.atMax = function() {
        if ($scope.files.length > 20)
            return true;
    };
});
