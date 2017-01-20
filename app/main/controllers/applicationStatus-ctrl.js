'use strict';
angular.module('myApp')
.controller('ApplicationStatusCtrl', function ($scope, $state, DataService, $timeout) {
  //1. things first, let's see how you create a new application:
  var requestContent = {foo: 'bar'};
  DataService.createApplication(requestContent).then(function (result) {
    if(result) {
      var insertedApplication = result;
      console.log('Originally inserted data:');
      console.log(insertedApplication);
      //The var "insertedApplication" above has the result of the insert, as does DataService.application

      //2. OK, how do you GET an application?
      DataService.getApplicationById(insertedApplication._id).then(function (result) {
        if(result) {
          var gottenApplication = result;
          console.log('GET data:');
          console.log(gottenApplication);
          //The var "gottenApplication" above has the result of the get, as does DataService.application

          //3. OK, how do you UPDATE an application?
          gottenApplication.request_content.updatedData = 'Here\'s a change';
          DataService.updateApplication(gottenApplication).then(function(result) {
            if(result) {
              var updatedApplication = result;
              console.log('Updated data:');
              console.log(updatedApplication);
              //For now, let's do it this way; this means we'll need a save button on each page, but converting it to be event-driven or watching the form adds a lot more complexity that we're not yet ready for.
            } else {
              //Todo: handle the error state
            }
          });
        } else {
          //Todo: handle the error state
        }
      });
    } else {
      //Todo: handle the error state
    }
  });
});
