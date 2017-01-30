'use strict';
var app = angular.module('myApp')
  .directive('signaturepad', ['$document', 'SignaturePad','$rootScope', function($document, SignaturePad,$rootScope) {
    return {

      scope: {
            signature: '='
        },
        templateUrl: 'main/templates/signaturePad.html',
      link: function(scope, element, attributes) {
        console.log(element.find('canvas')[0]);
        var signaturePad = new SignaturePad(element.find('canvas')[0]);
        var clearButton = document.getElementById('clear');
        var acceptButton = document.getElementById('accept');

        acceptButton.addEventListener('click', function (event) {
          scope.signature = signaturePad.toDataURL();

        });

        clearButton.addEventListener('click', function (event) {
         signaturePad.clear();
         scope.signature = undefined;
        });



      }
    };
  }]);
