'use strict';
angular.module('myApp')
.controller('ReviewSubmissionErrorModalCtrl', function ($uibModalInstance) {
  var $ctrl = this;

  $ctrl.ok = function () {
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

angular.module('myApp').component('modalComponent', {
  templateUrl: 'ReviewErrorModal.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.ok = function () {
      $ctrl.close();
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss();
    };
  }
});
