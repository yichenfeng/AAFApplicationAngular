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

  dataService.getApplications = function() {
    return $http({
      url: '/api/request/assistance/search',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332'
      },
      data: {status : { $ne : 'Draft' }}
    }).then(function successCallback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.getApplicationsForEmployee = function(employeeId) {
   return $http({
      url: '/api/request/assistance/search',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: {createdBy : employeeId}
    }).then(function callback(response) {
      console.log(response);
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.getApplicationsByStatus = function(status) {
   return $http({
      url: '/api/request/assistance/search',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: {status : status}
    }).then(function callback(response) {
      console.log(response);
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.getApplicationsByEmployeeAndStatus = function(employeeId, status) {
   return $http({
      url: '/api/request/assistance/search',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: { createdBy : employeeId, status : status}
    }).then(function callback(response) {
      console.log(response);
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
      data: application.requestContent
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        dataService.application = application;
        return application;
      }
      return false;
    });
  };

  dataService.updateAttachments = function(requestContent, id) {
    return $http({
      url: '/api/request/assistance/' + id + '/document',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      },
      data: requestContent
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.submitApplication = function(id) {
    return $http({
      url: '/api/request/assistance/' + id + '/submit',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      }
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.denyApplication = function(id) {
    return $http({
      url: '/api/request/assistance/' + id + '/deny',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      }
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.approveApplication = function(id) {
    return $http({
      url: '/api/request/assistance/' + id + '/approve',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      }
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  dataService.returnApplication = function(id) {
    return $http({
      url: '/api/request/assistance/' + id + '/return',
      method: 'POST',
      headers: {
        'OpenAMHeaderID': '10705332' //TODO: remove this, it wont be needed in prod
      }
    }).then(function callback(response) {
      if (response.data && response.data.status == "success") {
        return response.data.result;
      }
      return false;
    });
  };

  return dataService;
});
