'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'myApp.version', 'ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls', 'naif.base64', 'ngAnimate', 'ngSanitize', 'ui.bootstrap.tpls', 'ngTable'])
  .factory('SignaturePad', function(){
    return SignaturePad;
  })
  .run([
    "$rootScope", "$state", "$stateParams", "DataService", function ($rootScope, $state, $stateParams, DataService) {
      $rootScope.$state = $state;
      $rootScope.createApplication = function () {
        return DataService.createApplication({applicantInfo: {}, eligiblePersonnel: [], incidentInfo: {},
            assistanceRequested: {}, assistanceRecieved: {}, submitDetails: {}, reviewDetails: {}}).then(function (result) {
          if (result) {
            $rootScope.application = result;
          } else {
            console.log('Error creating application');
          }
        });
      }
      $rootScope.$watch(function() { return $rootScope.application; }, function (newValue) {
        if(newValue && newValue._id) {
          DataService.updateApplication(newValue).then(function (result) {
            if(result) {
              console.log('Updated application!');
            } else {
              console.log('Error updating application');
            }
          });
        }
      }, true);
    }
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'main/templates/home.html',
        controller: 'ApplicationStatusCtrl as ctrl'
      })
      .state('applicationInformation', {
        url: '/applicationInformation/:appId',
        templateUrl: 'main/templates/applicationInformation.html',
        controller: 'ApplicationInformationCtrl as ctrl'
      })
      .state('assistanceRequest', {
        url: '/assistanceRequest/:appId',
        templateUrl: 'main/templates/assistanceRequest.html',
        controller: 'AssistanceRequestCtrl as ctrl'
      })
      .state('eligiblePersonnel', {
        url: '/eligiblePersonnel/:appId',
        templateUrl: 'main/templates/eligablePersonnel.html',
        controller: 'EligablePersonnelCtrl as ctrl'
      })
      .state('incidentInfo', {
        url: '/incidentInfo/:appId',
        templateUrl: 'main/templates/incidentInfo.html',
        controller: 'IncidentInfoCtrl as ctrl'
      })
      .state('other', {
        url: '/other/:appId',
        templateUrl: 'main/templates/other.html',
        controller: 'OtherCtrl as ctrl'
      })
      .state('reviewSubmission', {
        url: '/review-submission/:appId',
        templateUrl: 'main/templates/review-submission.html',
        controller: 'ReviewSubmissionCtrl as ctrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'main/templates/login.html',
        controller: 'LoginCtrl as ctrl'
      })
      .state('attachments', {
        url: '/attachments/:appId',
        templateUrl: 'main/templates/attachments.html',
        controller: 'AttachmentsCtrl as ctrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'main/templates/partial-about.html'
      })
      .state('approver-application', {
        url: '/approver/application/:appId',
        templateUrl: 'main/templates/approver-application.html',
        controller: 'ApproverApplicationCtrl as ctrl'
      })
      .state('approverHome', {
        url: '/approver/home',
        templateUrl: 'main/templates/approver-home.html',
        controller: 'ApproverHomeCtrl as ctrl'
      })
      .state('approvePage', {
        url: '/approvePage/:appId',
        templateUrl: 'main/templates/approvePage.html',
        controller: 'ApprovePageCtrl as ctrl'
      })
      .state('approverDeny', {
        url: '/approver/deny/:appId',
        templateUrl: 'main/templates/approver-deny.html',
        controller: 'ApproverDenyCtrl as ctrl'
      });
  });
