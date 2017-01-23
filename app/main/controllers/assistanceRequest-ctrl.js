'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $state) {

var data = $scope.user;
// console.log(data);
$scope.submitForm = function(isValid) {

$scope.submitted = true;
// console.log(isValid.amount);

console.log($scope.user);

if (( $scope.user.options || $scope.user.fire || $scope.user.other || $scope.user.utilities || $scope.user.disaster || $scope.user.funeral) == true){
$state.go('other');
}

  };

  // $scope.nextValidation = function (info)
  // {
  //
  //   var amount = info.amount;
  //     var shelter = info.shelter;
  //     var funeral = info.funeral;
  //     var utilities = info.utilities;
  //     var fire = info.fire;
  //     var naturalDisaster = info.naturalDisaster;
  //     var other = info.other;
  //
  //     if (fire || funeral == true){
  //         $state.go('other');
  //     }
  //     else {
  //       console.log("not true");
  //     }
  //
  // };


});
