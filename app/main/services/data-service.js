'use strict';
angular.module('myApp')
.factory('DataService', function ($http) {
  var dataService = {};
  // factory function body that constructs shinyNewServiceInstance
  dataService.application = {};

  dataService.getApplicationById = function(id) {
    if(!id) {
      console.log("Unable to get application because there is no ID");
      return false;
    }
    return $http({
      url: '/api/request/assistance/' + id,
      method: 'GET',
      headers: {
        'OpenAMHeaderID': '10705332'
      }
    }).then(function successCallback(response) {
      if (response.data) {
        dataService.application = response.data.result;
        return response.data.result;
      }
      return false;
    });
  };

  dataService.getApplicationsForEmployee = function(employeeId) {
   return $http({
      url: '/api/request/assistancei/search',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: {created_by : employeeId}
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    }); 
  };

  dataService.createApplication = function(requestContent) {
    return $http({
      url: '/api/request/assistance',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: requestContent
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return dataService.getApplicationById(response.data.result);
      }
      return false;
    });
  };

  dataService.updateApplication = function(application) {
    if(!application._id) {
      console.log("Unable to update application because there is no ID");
      return false;
    }
    return $http({
      url: '/api/request/assistance/' + application._id,
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332'
      },
      data: application
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        dataService.application = application;
        return application;
      }
      return false;
    });
  };

  return dataService;
});
