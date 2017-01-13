'use strict';
angular.module('myApp').controller('IncidentInfoCtrl', function ($scope, $http) {

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
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

    $scope.max = 1000;
    $scope.count = 0;

    $scope.saveInfo = function() {
      var url = "http://skyline.autozone.com:5555/api/";
      var config = {
        headers : {
            'Content-Type': 'application/json;',
            'OpenAMHeaderID': '10705334'
        }
      };
      // var data = {
      //   user_id: passedIn.employeeID,
      //   name: passedIn.firstName,
      //   data: passedIn.address1
      // };
      // console.log(data);

      $http.get(url).success(function (data, status, headers, config) {
         console.log("success");
         console.log(data);
        //  $state.go('eligiblePersonnel',[]);
       }).error(function (data, status, header, config) {
         console.log("error");
         console.log(data);
       });
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
