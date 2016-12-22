'use strict';
angular.module('myApp')
.controller('ApplicationInformationCtrl', function ($scope, $state, $http) {

$scope.saveAppInfo = function (passedIn)
{
var url = "http://skyline.autozone.com:5555/api/request/assistance";
var config = {
                headers : {
                    'Content-Type': 'application/json;'
                }
            };
var data = {
                user_id: passedIn.employeeID,
                name: passedIn.firstName,
                data: passedIn.address1
            };
            console.log(data);

$http.post(url, data)
           .success(function (data, status, headers, config) {
             console.log("success");
             $state.go('eligiblePersonnel',[]);
           })
           .error(function (data, status, header, config) {
             console.log("error");
           });
};


});
