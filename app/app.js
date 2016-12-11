'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'myApp.version', 'ui.router'])
  .factory('SignaturePad', function(){
    return SignaturePad;
  })
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'main/templates/applicationStatus.html',
        controller: 'ApplicationStatusCtrl as ctrl'
      })
      .state('applicationInformation', {
        url: '/applicationInformation',
        templateUrl: 'main/templates/applicationInformation.html',
        controller: 'ApplicationInformationCtrl as ctrl'
      })
      .state('assistanceRequest', {
        url: '/assistanceRequest',
        templateUrl: 'main/templates/assistanceRequest.html',
        controller: 'AssistanceRequestCtrl as ctrl'
      })
      .state('eligiblePersonnel', {
        url: '/eligiblePersonnel',
        templateUrl: 'main/templates/eligablePersonnel.html',
        controller: 'EligablePersonnelCtrl as ctrl'
      })
      .state('incidentInfo', {
        url: '/incidentInfo',
        templateUrl: 'main/templates/incidentInfo.html',
        controller: 'IncidentInfoCtrl as ctrl'
      })
      .state('other', {
        url: '/other',
        templateUrl: 'main/templates/other.html',
        controller: 'OtherCtrl as ctrl'
      })
      .state('review-submission', {
        url: '/review-submission',
        templateUrl: 'main/templates/review-submission.html',
        controller: 'ReviewSubmissionCtrl as ctrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'main/templates/login.html',
        controller: 'LoginCtrl as ctrl'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'main/templates/partial-about.html'
      });
  });
