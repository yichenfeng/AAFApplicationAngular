'use strict';
angular.module('myApp').controller('IncidentInfoCtrl', function ($scope, $http, $state, DataService, $rootScope, $filter) {

  $scope.max = 1000;
  $scope.count = 0;

  $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.clear = function() {
    $scope.dt = null;
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

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
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

  $scope.saveForLater = function () {
    $state.go('home');
  };

  $scope.saveInfo = function() {
    if ($scope.incidentInfoForm.$valid) {
      $scope.dt = new Date(document.getElementById('date').value);
      $scope.dt = $filter('date')($scope.dt, 'MM/dd/yyyy');

      if ($rootScope.application) { //application created
        console.log('description = ' + $scope.description);
        $rootScope.application.request_content.updatedData = {
           'incident_date' : $scope.dt,
           'incident_description' : $scope.description
        };
        DataService.updateApplication($rootScope.application).then(function(result) {
          if(result) {
            var updatedApplication = result;
            console.log('Updated data:');
            console.log(updatedApplication);
            //For now, let's do it this way; this means we'll need a save button on each page, but converting it to be event-driven or watching the form adds a lot more complexity that we're not yet ready for.
          } else {
            //Todo: handle the error state
          }
        });
      }
    }
  };

  $scope.next = function () {
    if ($scope.incidentInfoForm.$valid) {
      $scope.saveInfo();
      $state.go('assistanceRequest');
    }
  };

}).directive('limitWords', [
  function() {
    return function(scope, element, attrs) {
      element.bind('keyup', function() {
        scope.count = this.value.split(' ').length;
        if (scope.count > scope.max) {
          this.maxLength = this.value.length;
        }
      });
    };
  }
]);
