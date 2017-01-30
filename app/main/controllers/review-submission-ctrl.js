'use strict';
 angular.module('myApp')
.controller('ReviewSubmissionCtrl', function ($scope, $state, DataService, $document,$uibModal, $rootScope, $filter, SignaturePad) {

var $ctrl = this;

  $scope.submit = function(isValid) {

      $scope.submitted = true;

      if(($rootScope.application.request_content.review.signature !== undefined) && (isValid == true)) {
         $state.go('home');
      }
        else if (isValid == false) {
          console.log("Valid Check failed");

      }
          else {
        $ctrl.open();
      }

    };


  $ctrl.animationsEnabled = true;

  $ctrl.open = function (size, parentSelector) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'ReviewErrorModal.html',
      controller: 'ReviewSubmissionErrorModalCtrl',
      controllerAs: '$ctrl',
      size: size,
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });

  };

    $scope.max = 1000;
    $scope.count = 0;

    $scope.today = function() {
      $scope.signatureDate = new Date();
    };

    $scope.clear = function() {
      $scope.signatureDate = null;
    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };

      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
      $scope.dateOptions.minDate = $scope.inlineOptions.minDate;


    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.signatureDate = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
    $scope.format = $scope.formats[3];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
          mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);
        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }


});
