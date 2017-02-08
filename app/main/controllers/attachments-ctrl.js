'use strict';
angular.module('myApp')
.controller('AttachmentsCtrl', function ($scope, $state, $rootScope, DataService, $stateParams) {

    if(!$stateParams.appId) {
      $state.go('applicationInformation', {});
    } else if(!$rootScope.application || $rootScope.application._id != $stateParams.appId) {
      DataService.getApplicationById($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
        } else {
          //TODO: handle error
        }
      });
    }

    $scope.saveLaterBtn = function() {
        $state.go('home');
    };

    $scope.name = '';
    $scope.files = $rootScope.application.documentation;
    $scope.error = false;
    $scope.$watch('files', function(newValue) {
        console.log(newValue);
        if(newValue) {
            if($rootScope.application) {
                DataService.updateAttachments($scope.files, $rootScope.application._id).then(function(result) {
                    if(result) {
                      var updatedAttachments = result;
                      console.log('result');
                      console.log($rootScope.application);
                      $scope.error = false;
                    } else {
                        console.log('error');
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
