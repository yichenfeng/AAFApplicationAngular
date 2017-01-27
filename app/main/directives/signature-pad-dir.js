'use strict';
var app = angular.module('myApp')
  .directive('signaturepad', ['$document', 'SignaturePad','$rootScope', function($document, SignaturePad,$rootScope) {
    return {
      templateUrl: 'main/templates/signaturePad.html',
      link: function(scope, element, attr) {
        console.log(element.find('canvas')[0]);
        var signaturePad = new SignaturePad(element.find('canvas')[0]);
        var clearButton = document.getElementById('clear');
        var acceptButton = document.getElementById('accept');

        clearButton.addEventListener('click', function (event) {
         signaturePad.clear();
         $rootScope.application.request_content.review.signature = undefined;
        });

        acceptButton.addEventListener('click', function (event) {
          $rootScope.application.request_content.review.signature = signaturePad.toDataURL();
        });

        // Returns true if canvas is empty, otherwise returns false
        signaturePad.isEmpty();

        // Unbinds all event handlers
        signaturePad.off();

        // Rebinds all event handlers
        signaturePad.on();
      }
    };
  }]);
