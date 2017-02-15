'use strict';
 angular.module('myApp')
.controller('ReviewSubmissionCtrl', function ($scope, $state, DataService, $document, $uibModal, $rootScope, $filter, SignaturePad, $stateParams) {

  var populateDate = function () {
    if ($rootScope.application.requestContent.submitDetails.submitDate) {
      $scope.dt = new Date($rootScope.application.requestContent.submitDetails.submitDate.$date);
    }
  };

  $scope.appId = '';
  if(!$stateParams.appId) {
    $state.go('applicationInformation', {});
  } else if(!$rootScope.application || $rootScope.application._id != $stateParams.appId) {
    DataService.getApplicationById($stateParams.appId).then(function (result) {
      if(result) {
        $rootScope.application = result;
        populateDate();
      } else {
        //TODO: handle error
      }
    });
  } else {
    populateDate();
  }

var $ctrl = this;

  $scope.submit = function(isValid) {

      $scope.submitted = true;

      if(($rootScope.application.requestContent.submitDetails.signature !== undefined) && (isValid === true)) {
        DataService.submitApplication($stateParams.appId).then(function (result) {
          if(result) {
            $rootScope.application = result;
            $state.go('home');
          }
        });
      }
        else if (isValid === false) {
          console.log("Valid Check failed");
      }
        else {
        $ctrl.open();
      }

    };

    $scope.dateChanged = function () {
      $scope.showErrorMessage = false;
      if ($rootScope.application) {
        var date = new Date(document.getElementById('reviewDate').value);
        $rootScope.application.requestContent.submitDetails = {
          'submitDate' : { $date : date }
        };
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
