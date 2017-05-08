'use strict';
angular.module('myApp')
.controller('AttachmentsCtrl', function ($scope, $state, $rootScope, DataService, $stateParams) {
  $scope.error = false;

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

  $scope.$watch('files', function(newValue) {
    if(newValue && newValue.length > 0) {
      if($rootScope.application) {
        DataService.updateAttachments(newValue[newValue.length - 1], $rootScope.application._id).then(function(result) {
          if(result) {
            angular.forEach(result, function (doc) {
              $rootScope.application.documentation.push(doc);
            });
            $scope.error = false;
          } else {
            console.log('error');
            $scope.error = true;
          }
        });
      }
    } else {
        //TODO:: handle nothing array (i.e. just deleted last item)
    }
  }, true);

  $scope.delete = function(index) {
    var id = $rootScope.application._id;
    var docId = $rootScope.application.documentation[index].docId;
    if($rootScope.application) {
      DataService.deleteAttachment(id, docId).then(function (result) {
        if(result) {
          $rootScope.application.documentation.splice(result, 1);
        }
      });
    }
  };

  $scope.addURL = function(newValue) {
    $rootScope.application.documentation.push({fileName:$scope.urlLink, description: "", base64String: "" });
  };

  $scope.atMax = function() {
    angular.element(document).ready(function () {
      if ($rootScope.application.documentation.length > 20) {
        return true;
      }
    });
  };
});
