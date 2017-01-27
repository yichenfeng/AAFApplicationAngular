'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'myApp.version', 'ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls'])
  .factory('SignaturePad', function(){
    return SignaturePad;
  })
  .run([
    "$rootScope", "$state", "$stateParams", "DataService", function ($rootScope, $state, $stateParams, DataService) {
      $rootScope.$state = $state;
      // return $rootScope.$stateParams = $stateParams;
      DataService.createApplication({applicantInfo: {}}).then(function (result) {
        if (result) {
          $rootScope.application = result;
          $rootScope.$watch(function() { return $rootScope.application; }, function (newValue) {
            console.log(newValue);
            DataService.updateApplication(newValue).then(function (result) {
              if(result) {
                console.log('Updated application!');
              } else {
                console.log('Error updating application');
              }
            });
          }, true);
        } else {
          console.log('Error creating application');
        }
      });
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
