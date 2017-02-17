'use strict';
angular.module('myApp')
.controller('ApproverApplicationCtrl', function ($scope, $state, $stateParams, DataService, $rootScope, $uibModal) {

  if(!$stateParams.appId) {
    $state.go('approverHome', []);
  }
  DataService.getApplicationById($stateParams.appId).then(function (result) {
    if(result) {
      $rootScope.application = result;
    } else {
      //TODO: handle error
    }
  });

  $scope.open = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'applicationReturnedModal.html',
      controller: 'ReturnModalCtrl',
      resolve: {
        comment: function () {
          return $scope.comment;
        }
      }
    });

    modalInstance.result.then(function (comment) {
      DataService.returnApplication($stateParams.appId).then(function (result) {
        if(result) {
          $rootScope.application = result;
          $rootScope.application.requestContent.reviewDetails.comments = comment;
          $state.go('approverHome');
        }
      });
    });
  };

  $scope.return = function () {
    $scope.open();
  };

  $scope.downloadFile = function (doc) {
    var id = $rootScope.application._id;
    var docId = doc.docId;
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
               byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    DataService.getAttachment(id, docId).then(function (result) {
        if(result) {
            var base64 = result.base64String;
            var fileName = result.fileName;
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = b64toBlob(base64, "octet/stream", 512);
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    });
  };
});
