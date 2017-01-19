'use strict';
angular.module('myApp')
.controller('AssistanceRequestCtrl', function ($scope, $state, ModalService) {


  $scope.saveRequestInfo = function (info)
  {

  {
    var amount = info.amount;
      var shelter = info.shelter;
      var funeral = info.funeral;
      var utilities = info.utilities;
      var fire = info.fire;
      var naturalDisaster = info.naturalDisaster;
      var other = info.other;

console.log(info);

if (fire || funeral == true){
console.log("true");
}
else {
  console.log("not true");
}

  };
    };

});
